import { getWorks, getCategories, displayWorks } from "./script.js";
//Si utilisateur connecté
function displayAminMode() {
  let token = sessionStorage.getItem("token");
  const header = document.querySelector("header");

  if (token) {
    //Ajouter bannière
    const addBanner = document.createElement("div");
    addBanner.className = "banner";
    addBanner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
    <span>Mode édition</span>`;
    header.prepend(addBanner); //Ajouter style au header

    header.style.marginTop = "80px"; //changer texte login à logout

    const login = document.querySelector(".login");
    login.innerHTML = `<li>logout</li>`; //enlever les boutons et ajouter icone édition

    const boutons = document.querySelector(".buttons");
    boutons.remove();

    const modifier = document.createElement("div");
    modifier.className = "modifier";
    modifier.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>
      <span>modifier</span>`;
    const modify = document.querySelector(".modify");
    modify.appendChild(modifier);
  }
}
displayAminMode();

//Si utilisateur non connecté
function closeAminMode() {
  const logout = document.querySelector(".login li:last-child");
  logout.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    console.log("Token supprimé");
    const token = sessionStorage.getItem("token");
    console.log("Token après suppression:", token); // Doit être null
    if (!token && window.location.href === "login.html") {
      console.log("Redirection vers index.html");
      window.location.href = "index.html";
    } else {
      console.log("La redirection n'a pas été effectuée");
    }
  });
}
closeAminMode();

//Ajouter fonction pour aouvrir la modale
function openModal() {
  const modifierIcone = document.querySelector(".modifier");
  modifierIcone.addEventListener("click", function () {
    const modal = document.querySelector(".modal");
    modal.style.display = "block";
  });
}
openModal();

//Ajouter fonction pour fermer la modale
function closeModal() {
  const xmark = document.querySelector(".modal__content--icon");
  const modal = document.querySelector(".modal");
  const modalAdd = document.querySelector(".add");
  xmark.addEventListener("click", function () {
    modal.style.display = "none";
  });

  const closeXmark = document.querySelector(".add__content--xmark");
  closeXmark.addEventListener("click", function () {
    modal.style.display = "none";
  });

  modal.addEventListener("click", function (event) {
    if (event.target.className == "modal") {
      modal.style.display = "none";
    }
  });

  modalAdd.addEventListener("click", function (event) {
    if (event.target.className == "add") {
      modalAdd.style.display = "none";
    }
  });
}
closeModal();

//Fonction pour faire apparaitre deuxième modale displayAddModal()
function changeModal() {
  const buttonModal = document.querySelector(".modal__content--button");
  const modalAdd = document.querySelector(".add");
  const modal = document.querySelector(".modal");
  const arrowLeft = document.querySelector(".add__content--arrow");
  const xmark = document.querySelector(".add__content--xmark"); // const close = document.querySelector(".modals");
  buttonModal.addEventListener("click", function () {
    modalAdd.style.display = "block";
    modal.style.display = "none";
  });

  arrowLeft.addEventListener("click", function () {
    modalAdd.style.display = "none";
    modal.style.display = "block";
  });

  xmark.addEventListener("click", function () {
    modal.style.display = "none";
    modalAdd.style.display = "none";
  });
}
changeModal();

//Fonctin pour ajouter travaux dans la modal displayGarageModal()
async function addWork() {
  const modalContainer = document.querySelector(".modal__content--container");
  modalContainer.innerHTML = "";
  const works = await getWorks();

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    const div = document.createElement("div");
    div.className = "trash-icon";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash-can";
    trashIcon.id = work.id;

    div.appendChild(trashIcon);
    figure.appendChild(image);
    figure.appendChild(div);
    modalContainer.appendChild(figure);
  });
  deleteWorks();
}
addWork();

//Supprimer un travail de la modal
async function deleteWorks() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = trash.id;
      const token = sessionStorage.getItem("token");

      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${id}`,
          init
        );
        if (response.ok) {
          console.log("Le travail a été supprimé avec succès");
          addWork(); // Réactualiser la liste après suppression // Fermer la modale et actualiser les travaux

          document.querySelector(".modal").style.display = "none";
          const updatedWorks = await getWorks();
          const sectionGallery = document.querySelector(".gallery");
          sectionGallery.innerHTML = ""; // Vider la galerie avant de la réafficher
          displayWorks(updatedWorks); // Afficher les travaux mis à jour
        } else {
          console.log("Le delete n'a pas fonctionné");
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la suppression du travail :",
          error
        );
      }
    });
  });
} //fonction pour faire apparaitre les catégories dans le menu déroulant

async function getCategoriesModal() {
  const select = document.querySelector("#category");
  const categories = await getCategories();

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
getCategoriesModal(); // prévisualiser une image dans la modal

const previewImage = document.querySelector(".form__content img");
const previewInput = document.querySelector(".form__content input");
const previewLabel = document.querySelector(".form__content label");
const previewIcon = document.querySelector(".form__content i");
const previewText = document.querySelector(".form__content p");

previewInput.addEventListener("change", function () {
  const file = previewInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      previewImage.src = event.target.result;
      previewImage.style.display = "block";
      previewLabel.style.display = "none";
      previewIcon.style.display = "none";
      previewText.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

//Faire une requête POST pour ajouter un travail
function handleFormSubmit() {
  const form = document.querySelector(".form"); //form.reset(); // Vider le formulaire
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("file");
    const imageFile = fileInput.files[0]; // Créer un FormData pour envoyer le fichier et les autres données

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", imageFile);

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Le travail a été ajouté avec succès"); // Fermer la modale et actualiser les travaux
        document.querySelector(".add").style.display = "none";
        addWork(); // Met à jour la liste des travaux
        const updatedWorks = await getWorks();
        const sectionGallery = document.querySelector(".gallery");
        sectionGallery.innerHTML = ""; // Vider la galerie avant de la réafficher
        displayWorks(updatedWorks); // Mettre à jour la galerie avec les nouveaux travaux
      } else {
        console.log("L'ajout du travail a échoué", data);
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'ajout du travail :",
        error
      );
    }
  });
}

handleFormSubmit();

//Fonction pour vérifier que tous les input sont remplis
function validateForm() {
  const buttonForm = document.querySelector(".form button");
  const form = document.querySelector(".form");

  form.addEventListener("input", function () {
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const fileInput = document.getElementById("file").files.length; // Vérifier s'il y a déjà un message d'erreur

    let errorMessage = document.querySelector(".msg-error");

    if (title && category && fileInput) {
      buttonForm.classList.add("valid");
      buttonForm.disabled = false; // Supprimer le message d'erreur s'il existe et que tous les champs sont remplis

      if (errorMessage) {
        errorMessage.remove();
      }
    } else {
      buttonForm.classList.remove("valid");
      buttonForm.disabled = true; // Ajouter un message d'erreur s'il n'existe pas déjà

      if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.className = "msg-error";
        errorMessage.innerHTML = "Veuillez remplir tous les champs.";
        document.querySelector(".form").prepend(errorMessage);
      }
    }
  });
}

validateForm();
