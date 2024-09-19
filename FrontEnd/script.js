//Récupérer les travaux à partir du backend
export const getWorks = async () => {
  try {
    const travaux = await fetch("http://localhost:5678/api/works");
    const works = await travaux.json();
    return works;
  } catch (error) {
    console.error(error);
  }
};

const works = await getWorks();
console.log(works);

//Récupérer les catégories à partir du backend

export const getCategories = async () => {
  try {
    const group = await fetch("http://localhost:5678/api/categories");
    const categories = await group.json();
    return categories;
  } catch (error) {
    console.error(error);
  }
};

const categories = await getCategories();

// Fonction pour afficher les travaux
export function displayWorks(works) {
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

    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
    sectionGallery.appendChild(figureElement);
  });
}

displayWorks(works);

//Fonction pour afficher les boutons avec les catégories
function displayCategories(works, categories) {
  //Récupérer div pour hébérger les boutons
  const divButtons = document.querySelector(".buttons");
  //Créer boutons "Tous"
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.className = "btn btn-all btn-selected";
  btnAll.id = 0;
  //Ajouter bouton "Tous" à divButtons
  divButtons.appendChild(btnAll);

  //Créer le reste des boutons avec les catégories
  categories.forEach((categorie) => {
    const btnCategorie = document.createElement("button");
    btnCategorie.textContent = categorie.name;
    btnCategorie.className = "btn";
    btnCategorie.id = categorie.id;
    //Ajouter bouton à divButtons
    divButtons.appendChild(btnCategorie);
  });

  //Ajouter écouteur d'événement sur les boutons
  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      btns.forEach((btn) => {
        btn.classList.remove("btn-selected");
      });
      this.classList.add("btn-selected");
      const categorieId = parseInt(this.id);
      //Filtrer les travaux selon la catégorie
      const gallerySection = document.querySelector(".gallery");
      gallerySection.innerHTML = "";
      if (categorieId === 0) {
        displayWorks(works);
      } else {
        const filterdWorks = works.filter(
          (work) => work.categoryId === categorieId
        );
        displayWorks(filterdWorks);
      }
    });
  });
}
displayCategories(works, categories);
