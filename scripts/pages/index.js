// Import
import { Photographer } from "../templates/photographer.js";
import { getPhotographers } from "../utils/APIfetch.js";

/* Affichage des photographes sur page d'accueil */
const displayData = async (photographers) => {
  const photographersSection = document.querySelector(".photographer_section");
  photographersSection.innerHTML = "";

  photographers.forEach((photographer) => {
    const photographerModel = new Photographer(photographer);
    photographersSection.innerHTML += photographerModel.userCardDOM;
  });
};

/* Initialisation de la page d'accueil */
const homepage = async () => {
  const { photographers } = await getPhotographers();
  displayData(photographers);
};

homepage();
