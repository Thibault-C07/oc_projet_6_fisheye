// Import
import { Photographer } from "../templates/photographer.js";
import { Media } from "../templates/media.js";
import { Likes } from "../templates/likes.js";
import { Lightbox } from "../templates/lightbox.js";

import { getPhotographers } from "../utils/APIfetch.js";
import { displayModal } from "../utils/modal.js";
import { sortbyOption, readSelectedOption } from "../utils/sort.js";

/* Sélection du photographe par l'id */
const selectPhotograph = (photographList, Id) => {
  return photographList.find((photograph) => photograph.id === Id);
};

/* Header du photographe avec photo */
const displayPhotographHeader = (photograph) => {
  // Création d'une instance et appel de userData
  const photographHeader = document.querySelector(".photograph-header");
  const photographModel = new Photographer(photograph);
  photographHeader.innerHTML = photographModel.userData;

  // Appel de userName pour initialiser le nom du photographe dans la modale
  const photographName = document.querySelector(".modal_name");
  photographName.innerHTML += `<br>${photographModel.userName}`;

  // Mise à jour du title avec le nom du photographe
  document.title += photographModel.userTitle;
};

/* Affichage de la galerie du photographe grace à l'id */
const displayPhotographGallery = (media, photograph) => {
  const photographGallery = document.querySelector(".photograph-gallery");

  // fonction mise à jour de la galerie présentée en fonction de l'option sélectionnée
  const updateGallery = (media) => {
    photographGallery.innerHTML = "";
    media = sortbyOption(media, readSelectedOption());

    media.forEach((mediaItem) => {
      // si l'id est celui du photographe, on traite
      if (photograph.id === mediaItem.photographerId) {
        const mediaModel = new Media(mediaItem);

        // récupérer le nom du photographe pour renseigner le répertoire des images
        mediaModel.mediaDirectory = photographName;

        // afficher la photo ou la video
        photographGallery.innerHTML += mediaModel.userGalleryCard;
      }
    });
  };

  // fonction réinitialisant le total des likes sur le panneau de bas de page
  const updateTotalLikes = () => {
    const photographPricePanel = document.querySelector(
      ".photograph-price-panel"
    );
    const photographModel = new Photographer(photograph);

    photographPricePanel.innerHTML = photographModel.userPanelPrice;
  };

  // Récupération du nom du photograhe pour connaître le répertoire des medias
  let photographName = photograph.name;
  photographName = photographName.split(" ")[0];

  /* Succession de mise à jour et d'initialisation pour l'affichage correcte de la page */
  updateGallery(media);

  // Mise à jour du panel price avec les likes
  updateTotalLikes();

  // On initialise la lightbox et les likes
  Lightbox.init();
  Likes.init();

  // On active le listener sur le formulaire de contact
  const contactButton = document.getElementById("contact_button");
  contactButton.addEventListener("click", (e) => {
    e.preventDefault();
    displayModal();
  });

  // Activation du listener sur le tri des options
  const selectButton = document.getElementById("photograph-gallery-select");
  selectButton.addEventListener("change", (e) => {
    e.preventDefault();
    // Mise à jour de la galerie et update du totalLikes
    updateGallery(media);
    updateTotalLikes();

    // Re initialisation de la lightbox et des likes
    Lightbox.init();
    Likes.init();
  });
};

/* Initialisation de la page photographe */
const initPhotographers = async () => {
  // Récupération de l'id et de la liste des photographes via l'API
  const identifier = parseInt(
    location.search.substring(1).split("&")[0].split("=")[1]
  );
  const { photographers, media } = await getPhotographers();

  // Sélection du photographe pour affichage header et galerie
  const selectedPhotograph = selectPhotograph(photographers, identifier);

  displayPhotographHeader(selectedPhotograph);
  displayPhotographGallery(media, selectedPhotograph);
};

initPhotographers();
