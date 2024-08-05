//Récupération des travaux de l'API avec une fonction asynchrone
async function getWorks() {
  const travail = await fetch("http://localhost:5678/api/works");
  const works = await travail.json();
  return works;
}
const works = await getWorks();
