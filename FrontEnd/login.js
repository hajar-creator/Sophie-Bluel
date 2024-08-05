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
