// Récupération des travaux depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();
console.log(works);

function genererWorks(works){
     for(let i=0; i<works.length; i++){
        const project = works[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à une oeuvre
         const figureElement = document.createElement("figure");
         // Création des balises
         const imageElement = document.createElement("img");
          imageElement.src = project.imageUrl;
          const captionElement = document.createElement("figcaption");
          captionElement.innerText = project.title;

          // On rattache la balise article a la section Gallery
          sectionGallery.appendChild(figureElement);
           figureElement.appendChild(imageElement);
           figureElement.appendChild(captionElement);

        }
}
genererWorks(works);


// Récupération des catégories depuis le fichier JSON
const answer = await fetch('http://localhost:5678/api/categories');
const categories = await answer.json();
//Fonction map pour récupérer catégories
const typeName = categories.map(categorie => categorie.name);
console.log(typeName);

//Création du menu des catégories
function genererMenuCategories (){
const portfolioSection = document.getElementById("portfolio");
const btnContainer = document.createElement("div");
btnContainer.className = "btns";

//Tableau détail boutons
const buttons = [
    { class: 'btn btn-all btn-selected', text: 'Tous' },
    { class: 'btn btn-objet', text: 'Objets' },
    { class: 'btn btn-appart', text: 'Appartements' },
    { class: 'btn btn-hotels', text: 'Hotels & restaurants' }
];

//Boucle for pour la création des boutons
for(let i=0; i<buttons.length; i++){
     const button = document.createElement("button");
    button.className = buttons[i].class;
    button.textContent = buttons[i].text;
    btnContainer.appendChild(button);
}
portfolioSection.appendChild(btnContainer);

// Insérer les boutons avant le div avec la classe 'gallery'
const galleryDiv = document.querySelector('#portfolio .gallery');
galleryDiv.parentNode.insertBefore(btnContainer, galleryDiv);}
//Appeller la fonction
genererMenuCategories();

//Sélectionner tous les boutons
const btnsFilter = document.querySelectorAll(".btn");
