//Récupération des travaux de l'API avec une fonction asynchrone
async function getWorks() {
  const travail = await fetch("http://localhost:5678/api/works");
  const works = await travail.json();
  return works;
}
const works = await getWorks();

//Fonction pour récupérer les travaux de l'API et les afficher sur le site
function genererWorks(works) {
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
