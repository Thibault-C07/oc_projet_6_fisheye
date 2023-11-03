// Import
import { Photographer } from "../templates/photographer.js";
import { getPhotographers } from "../utils/APIfetch.js";

/* Affichage des photographes sur page d'accueil */
async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");
  photographersSection.innerHTML = "";

  photographers.forEach((photographer) => {
    const photographerModel = new Photographer(photographer);
    photographersSection.innerHTML += photographerModel.userCardDOM;
  });
}

/* Initialisation de la page d'accueil */
async function init() {
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
