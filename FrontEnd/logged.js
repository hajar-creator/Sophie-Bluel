import { getWorks, getCategories } from "./script.js";
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
    header.style.marginTop = "80px";

    //Changer texte login à logout
    const login = document.querySelector(".login");
    login.innerHTML = `<li>logout</li>`;

    //Enlever les boutons et ajouter icone édition
    const boutons = document.querySelector(".buttons");
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

//Si utilisateur non connecté
function closeAdminMode() {
  const logout = document.querySelector(".login li:last-child");
  logout.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    console.log("Utilisateur déconnecté");
    const token = sessionStorage.getItem("token");
    console.log("Token après déconnexion : ", token); //Doit être null
    if (token === null) {
      window.location.href = "index.html";
      console.log("Redirection vers la page d'accueil");
    } else {
      console.log("La redirection n'a pas eu lieu");
    }
  });
}
closeAdminMode();

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
  const modal = document.querySelector(".modal");
  const modalAdd = document.querySelector(".add");
  const closeXmark = document.querySelector(".add__content--xmark");

  xmark.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeXmark.addEventListener("click", function () {
    modal.style.display = "none";
  });

  modal.addEventListener("click", function (e) {
    if (e.target.className == "modal") {
      modal.style.display = "none";
    }
  });

  modalAdd.addEventListener("click", function (e) {
    if (e.target.className == "add") {
      modalAdd.style.display = "none";
    }
  });
}
closeModal();

//Fonctoion pour faire apparaitre modale pour ajouter une oeuvre
function changeModal() {
  const buttonModal = document.querySelector(".modal__content--button");
  const modalAdd = document.querySelector(".add");
  const modal = document.querySelector(".modal");
  const arrowLeft = document.querySelector(".add__content--arrow");
  const xmark = document.querySelector(".add__content--xmark");

  buttonModal.addEventListener("click", function () {
    modalAdd.style.display = "block";
    modal.style.display = "none";
  });

  arrowLeft.addEventListener("click", function () {
    modalAdd.style.display = "none";
    modal.style.display = "block";
  });

  xmark.addEventListener("click", function () {
    modalAdd.style.display = "none";
    modal.style.display = "none";
  });
}
changeModal();

//Ajouter les travaux à la modale
async function addWorks() {
  const modalContainer = document.querySelector(".modal__content--container");
  modalContainer.innerHTML = "";
  const works = await getWorks();

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
            console.log(response);
            console.log("Le travail a bien été supprimé");
            addWorks();
          } else {
            console.log("Le delete n'a pas fonctionné");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de l'oeuvre : ", error);
        });
    });
  });
}

//fonction pour afficher les catégories dans le menu déroulant
async function displayModalCategories() {
  const select = document.querySelector(".form__content--select");
  const categories = await getCategories();

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

//fonction pour prévisualiser une image dans la modale
function previewImage() {
  const previewImg = document.querySelector(".form__content--img");
  const previewLabel = document.querySelector(".form__content--label");
  const previewInput = document.querySelector(".form__content--input");
  const previexIcon = document.querySelector(".form__content i");
  const previewText = document.querySelector(".form__content p");

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

//Fonction pour vérifier que tous les inputs du formulaire sont remplis

function validateForm() {
  const buttonForm = document.querySelector(".form button");
  const form = document.querySelector(".form");
  form.addEventListener("input", function () {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("file").files.length;

    //Vérifier s'il y a déjà un message d'erreur
    let errorMessage = document.querySelector(".msg-error");

    if (title && category && fileInput) {
      buttonForm.classList.add("valid");
      buttonForm.disabled = false;

      //Supprimer le message d'erreur s'il existe
      if (errorMessage) {
        errorMessage.remove();
      }
    } else {
      buttonForm.classList.remove("valid");
      buttonForm.disabled = false;

      //Ajouter un message d'erreur s'il n'existe pas
      if (!errorMessage) {
        const modalTitle = (document.querySelector(
          ".add__content--title"
        ).style.marginBottom = "20px");
        errorMessage = document.createElement("p");
        errorMessage.className = "msg-error";
        errorMessage.innerText = "Veuillez remplir tous les champs";
        document.querySelector(".form").prepend(errorMessage);
      }
    }
  });
}

validateForm();
