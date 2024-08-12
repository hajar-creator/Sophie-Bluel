//
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("test");

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
    let token = sessionStorage.getItem("token");
    const header = document.querySelector("header");
    console.log(token);
    if (token) {
      //Ajouter bannière
      const addBanner = document.createElement("div");
      addBanner.className = "banner";
      addBanner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
        <span>Mode édition</span>`;
      header.prepend(addBanner);

      //Changer texte login à logout
      const login = document.querySelector(".login__index");
      login.innerHTML = `<li>logout</li>`;

      //Enlever les boutons et ajouter icone édition
      const boutons = document.querySelector(".boutons");
      console.log(boutons);
      boutons.remove();

      const modifier = document.createElement("div");
      modifier.className = "modifier";
      modifier.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
        <span>modifier</span>`;
      const portfolio = document.querySelector("#portfolio");
      portfolio.prepend(modifier);
    }
  }
  displayAdminMode();

  //Modale

  //Fonction pour ouvrir la modale
  function openModal() {
    const modifierIcone = document.querySelector(".modifier .fa-solid");
    modifierIcone.addEventListener("click", function () {
      console.log("cliqué");
      const modal = document.querySelector(".modal");
      modal.style.display = "block";
    });
  }
  openModal();

  //Fonction pour fermer la modale
  function closeModal() {
    const xmark = document.querySelector(".modal__content--icon");
    xmark.addEventListener("click", function () {
      console.log("cliqué");
      const modal = document.querySelector(".modal");
      modal.style.display = "none";
    });
  }
  closeModal();

  //Si l'utilisateur n'est pas connecté
  function loggedOutAdminMode() {
    let token = sessionStorage.removeItem("token");
    let isLoggedOut = !!token;
    if (isLoggedOut) {
      //enlever bannière
      const banner = document.querySelector(".banner");
      banner.remove();
    }
  }
  loggedOutAdminMode();
});
