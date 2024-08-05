//Fonction pour envoyer requête à l'API pour se connecter au mode édition
async function submitForm() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    //Ciblage des champs email et password
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    //Récupération de la valeur des champs email et password
    const email = emailInput.value;
    const password = passwordInput.value;

    // Création d'un nouvel objet contenant les valeurs des champs du formulaire
    const data = {
      email: email,
      password: password,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(data);

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
      });

      //Récupération réponse API au format JSON
      const result = await response.json();
      console.log(result);

      //Validation avec token
      if (response.ok && result.token) {
        sessionStorage.setItem("token", result.token);
        window.location.href = "index.html";
      } else {
        const erreurMessage = document.createElement("p");
        erreurMessage.className = "erreur-login";
        erreurMessage.innerText = "Identifiants incorrects";
        document.querySelector("form").prepend(erreurMessage);
      }
    } catch (erreur) {
      console.error(erreur);
    }
  });
}
submitForm();

//Si utilisateur connecté
function displayAdminMode() {
  const token = sessionStorage.getItem("token");
  if (token) {
    //Ajouter bannière
    const header = document.querySelector("header");
    const addBanner = document.createElement("div");
    addBanner.className = "banner";
    addBanner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
        <span>Mode édition</span>`;
    header.prepend(addBanner);

    //Changer texte login à logout
    const login = document.querySelector(".login__index");
    login.innerHTML = `<a href="login.html" class="login__index"><li>logout</li></a>`;

    //Enlever les boutons et ajouter icone édition
    const boutons = document.querySelector(".btns");
    console.log(boutons);
    //divBtns.remove()

    const modifier = document.createElement("div");
    modifier.className = "modifier";
    modifier.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
        <span>modifier</span>`;
    const portfolio = document.querySelector("#portfolio");
    portfolio.prepend(modifier);
  }
}
displayAdminMode();
