// Sélectionne le photographe avec l'id
function selectPhotograph(photographList, Id) {
  return photographList.find((photograph) => photograph.id == Id);
}

// Affichage header du photographe
function displayPhotographHeader(photograph) {
  // création d'une instance de Photographer et appel de userData
  const photographHeader = document.querySelector(".photograph-header");
  const photographModel = new Photographer(photograph);
  photographHeader.innerHTML = photographModel.userData;

  // Appel de userName pour initialiser le nom du photographe dans la modale
  const photographName = document.querySelector(".modal_name");
  photographName.innerHTML += photographModel.userName;

  // mise à jour du title avec le nom du photographe
  document.title += photographModel.userTitle;
}

// Affichage de la galerie du photographe
function displayPhotographGallery(media, photograph) {
  const photographGallery = document.querySelector(".photograph-gallery");

  // récupérer le nom du photograhe
  let photographName = photograph.name;
  photographName = photographName.split(" ")[0];

  media.forEach((mediaItem) => {
    // si l'id est celui du photographe, on traite
    if (photograph.id == mediaItem.photographerId) {
      const photographModel = new Media(mediaItem);

      // récupérer le nom du photographe pour renseigner le répertoire des images
      photographModel.mediaDirectory = photographName;

      // afficher la photo
      photographGallery.innerHTML += photographModel.userGalleryCard;
    }
  });

  // Maintenant que la gallery est affichée, on met à jour la panel price avec les likes
  const photographPricePanel = document.querySelector(
    ".photograph-price-panel"
  );
  const photographModel = new Photographer(photograph);

  photographPricePanel.innerHTML = photographModel.userPanelPrice;
}

async function init() {
  // Récupération de l'id et de la liste des photographes via l'API
  const identifier = location.search.substring(1).split("&")[0].split("=")[1];
  const { photographers, media } = await getPhotographers();

  // Sélection du photographe pour affichage header et galerie
  const selectedPhotograph = selectPhotograph(photographers, identifier);

  displayPhotographHeader(selectedPhotograph);
  displayPhotographGallery(media, selectedPhotograph);

  // Management de la lightbox
  Lightbox.init();

  // Management des likes
  Likes.init();
}

init();
