//Récupération des travaux de l'API avec une fonction asynchrone
async function getWorks() {
  const travail = await fetch("http://localhost:5678/api/works");
  const works = await travail.json();
  return works;
}
const works = await getWorks();
console.log(works);

//Fonction pour récupérer les travaux de l'API et les afficher sur le site
function genererWorks(works) {
  // Boucle forEach pour l'affichage des travaux
  works.forEach((work) => {
    //Récupération de l'élément DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Création d'une balise dédiée à chaque oeuvre
    const figureElement = document.createElement("figure");
    // Création des balises img + leur contenu
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = work.title;

    //On rattache les balises à la section gallery
    sectionGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
  });
}

// On appelle la fonction genererWorks(works) pour afficher les travaux
genererWorks(works);

// Fonction pour créations des boutons des filtres
async function genererBtnCategories() {
  //Création des conteneurs pour les boutons et ajout du btn "Tous"
  // const divBtns = document.createElement("div");
  // divBtns.className = "btns";
  const divBtns = document.querySelector(".boutons");
  const buttonTous = document.createElement("button");
  buttonTous.className = "btn btn-selected";
  buttonTous.textContent = "Tous";

  buttonTous.addEventListener("click", function () {
    //On supprime la classe "btn-selected" de tous les boutons
    const allBtns = divBtns.querySelectorAll("button");
    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove("btn-selected");
    }

    //On ajoute la classe "btn-selected" que sur le bouton auquel s'applique l'eventListener
    this.classList.add("btn-selected");

    //filtrage des catégories
    const categorie = this.textContent;
    console.log(categorie);
    filtrerCategories(categorie, works);
  });
  //On rattache le btn "Tous" à la div qui l'aberge'
  divBtns.appendChild(buttonTous);

  //Récupération de l'API catégories pour obtenir les noms du reste des boutons
  const group = await fetch("http://localhost:5678/api/categories");
  const categories = await group.json();

  //Récupération de la section qui a pour id "gallery"
  const gallerySection = document.getElementById("portfolio");
  // Boucle forEach pour la création et l'affichage du reste des boutons
  categories.forEach((categorie) => {
    console.log(categorie);
    const categorieBtns = document.createElement("button");
    categorieBtns.className = "btn";
    categorieBtns.textContent = categorie.name;
    //On rattache les boutons à la div qui aberge les boutons puis à la section "gallery"
    divBtns.appendChild(categorieBtns);
    gallerySection.appendChild(divBtns);
    //On insère la div contenant les boutons avant les travaux
    const galleryDiv = document.querySelector("#portfolio .gallery");
    galleryDiv.parentNode.insertBefore(divBtns, galleryDiv);

    console.log(divBtns);
    //On récupère tous les boutons de la div
    const allBtns = divBtns.querySelectorAll("button");

    categorieBtns.addEventListener("click", function () {
      //On supprime la classe "btn-selected" de tous les boutons
      const allBtns = divBtns.querySelectorAll("button");
      for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove("btn-selected");
      }

      //On ajoute la classe "btn-selected" que sur le bouton auquel s'applique l'eventListener
      this.classList.add("btn-selected");

      //filtrage des catégories
      const categorie = this.textContent;
      console.log(categorie);
      filtrerCategories(categorie, works);
    });

    //On ajoute un écouteur d'évènements pour chaque bouton
    // allBtns.forEach((button) => {
    //   console.log(button);
    //   button.addEventListener("click", function () {
    //     //On supprime la classe "btn-selected" de tous les boutons
    //     for (let i = 0; i < allBtns.length; i++) {
    //       allBtns[i].classList.remove("btn-selected");
    //     }
    //     //On ajoute la classe "btn-selected" que sur le bouton auquel s'applique l'eventListener
    //     button.classList.add("btn-selected");

    //     //filtrage des catégories
    //     const categorie = this.textContent;
    //     console.log(categorie);
    //     filtrerCategories(categorie, works);
    //   });
    // });
  });
}
// On affiche les boutons en appelant la fonction
genererBtnCategories();

//Fonction pour filtrer les catégories
async function filtrerCategories(categorie, works) {
  const sectionGallery = document.querySelector(".gallery");
  sectionGallery.innerHTML = "";

  if (categorie === "Tous") {
    genererWorks(works);
  } else {
    const travauxFiltrees = works.filter(function (work) {
      return work.category.name === categorie;
    });
    genererWorks(travauxFiltrees);
  }
}
