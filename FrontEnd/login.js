//importer fonctions et modules de script.js
//import { getWorks } from "./script.js";
document.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault();
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
      boutons.style.display = "none";

      const modifier = document.createElement("div");
      modifier.className = "modifier";
      modifier.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
        <span>modifier</span>`;
      const portfolio = document.querySelector(".modify");
      portfolio.prepend(modifier);
    }
  }
  displayAdminMode();

  //Modale

  //Fonction pour ouvrir la modale
  function openModal() {
    const modifierIcone = document.querySelector(".modifier");
    if (modifierIcone != null) {
      modifierIcone.addEventListener("click", function () {
        const modal = document.querySelector(".modal");
        modal.style.display = "block";
      });
    }
  }
  openModal();

  //Fonction pour fermer la modale
  function closeModal() {
    const xmark = document.querySelector(".modal__content--icon");
    if (xmark != null) {
      xmark.addEventListener("click", function () {
        console.log("cliqué");
        const modal = document.querySelector(".modal");
        modal.style.display = "none";
      });
    }
  }
  closeModal();

  //Fermer la modale quand l'utilisateur clique en dehors de la modale
  function outsideClick() {
    const modal = document.querySelector(".modal");
    const add = document.querySelector(".add");
    if (modal != null && add != null) {
      modal.addEventListener("click", function (e) {
        if (e.target.className == "modal") {
          modal.style.display = "none";
        }
      });
      add.addEventListener("click", function (e) {
        if (e.target.className == "add") {
          add.style.display = "none";
          modal.style.display = "none";
        }
      });
    }
  }
  outsideClick();
  //Si l'utilisateur n'est pas connecté
  function loggedOutAdminMode() {
    // const logout = document.querySelector(".login__index li:last-child");
    // if (logout != null) {
    //   logout.addEventListener("click", function () {
    //     console.log("deconnecté");
    //     window.location.href = "index.html";
    //     sessionStorage.removeItem("token");
    //     const header = document.querySelector("header");
    //     header.style.marginTop = "0";
    //   });
    // }
  }
  loggedOutAdminMode();

  //Ajouter les travaux à la modale
  async function addWorks() {
    const modalContainer = document.querySelector(".modal__content--container");
    if (modalContainer != null) {
      modalContainer.innerHTML = "";

      // const works = await getWorks();
      // console.log(works);

      const travail = await fetch("http://localhost:5678/api/works");
      const works = await travail.json();
      works.forEach((work) => {
        //création d'une balise dédiée à chaque oeuvre
        const figure = document.createElement("figure");
        // Création des balises img + leur contenu
        const image = document.createElement("img");
        image.src = work.imageUrl;
        const div = document.createElement("div");
        div.className = "trash-icon";
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";
        trashIcon.id = work.id;

        //On rattache les balises à la section gallery
        div.appendChild(trashIcon);
        figure.appendChild(image);
        figure.appendChild(div);
        modalContainer.appendChild(figure);
      });
    }
    deleteWork();
  }
  addWorks();

  //Fonction pour supprimer une oeuvre de la modale
  function deleteWork() {
    const trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        const id = trash.id;
        const token = sessionStorage.getItem("token");

        const init = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        fetch("http://localhost:5678/api/works/" + id, init)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.log("Le delete n'a pas fonctionné");
            }
          })
          .then((data) => {
            console.log(
              "Le travail a bien été supprimé, voici la data : ",
              data
            );
            // On récupère les oeuvres et on les affiche dans la modale
            addWorks();
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la suppression de l'oeuvre : ",
              error
            );
          });
      });
    });
  }

  //fonction pour afficher les catégories dans le menu déroulant
  async function displayModalCategories() {
    const select = document.querySelector(".form__content--select");
    const group = await fetch("http://localhost:5678/api/categories");
    const categories = await group.json();

    if (select != null) {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        select.appendChild(option);
      });
    }
  }
  displayModalCategories();
  //fonctoion pour faire apparaitre modale pour ajouter une oeuvre
  function changeModal() {
    const buttonModal = document.querySelector(".modal__content--button");
    const modalAddPic = document.querySelector(".add");
    const modal = document.querySelector(".modal");
    const arrowLeft = document.querySelector(".add__content--arrow");
    const xmark = document.querySelector(".add__content--xmark");
    const closeModal = document.querySelector(".modals");

    if (buttonModal != null && arrowLeft != null && xmark != null) {
      buttonModal.addEventListener("click", function () {
        modalAddPic.style.display = "block";
        modal.style.display = "block";
      });
      arrowLeft.addEventListener("click", function () {
        modalAddPic.style.display = "none";
        modal.style.display = "block";
      });
      xmark.addEventListener("click", function () {
        modalAddPic.style.display = "none";
        modal.style.display = "none";
      });
    }
  }
  changeModal();

  //fonction pour prévisualiser une image dans la modale
  function previewImage() {
    const previewImg = document.querySelector(".form__content--img");
    const previewLabel = document.querySelector(".form__content--label");
    const previewInput = document.querySelector(".form__content--input");
    const previexIcon = document.querySelector(".form__content i");
    const previewText = document.querySelector(".form__content p");

    if (previewInput != null) {
      previewInput.addEventListener("change", function () {
        const file = previewInput.files[0];
        if (file.type.match("image.*")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            previewLabel.style.display = "none";
            previexIcon.style.display = "none";
            previewText.style.display = "none";
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
  previewImage();

  //Ajout d'une image dans la base de données
  function addImage() {
    const form = document.querySelector(".form");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const category = document.getElementById("category");
      const fileInput = document.getElementById("file");
      const imageFile = fileInput.files[0];

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category.value);
      formData.append("image", imageFile);

      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        });

        if (response.ok) {
          console.log("Travail ajoutée avec succès");
          document.querySelector(".add").style.display = "none";
          addWorks();
        } else {
          console.log("L'ajout du travail a échoué");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du travail : ", error);
      }
    });
  }

  addImage();
});
