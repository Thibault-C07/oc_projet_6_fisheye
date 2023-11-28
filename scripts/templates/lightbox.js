export class Lightbox {
  static init() {
    const gallerySection = document.querySelector(".photograph-gallery");
    const links = Array.from(
      gallerySection.querySelectorAll('img[src$=".jpg"], video[src$=".mp4"]')
    );
    const images = links.map((link) => link.getAttribute("src"));

    // listener sur clic image ou video pour lancer la lightbox
    links.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        new Lightbox(e.currentTarget.getAttribute("src"), images, link);
      })
    );

    // listener sur touche enter pour lancer la lightbox
    links.forEach((link) =>
      link.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
          new Lightbox(e.currentTarget.getAttribute("src"), images, link);
        }
        return;
      })
    );
  }

  constructor(url, images, link) {
    this.element = this.buildDOM();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.images = images;
    this.loadImage(url);
    this.link = link;
    document.body.appendChild(this.element);
    this.initFocus();
    this.ariaHide(false);

    /* listener touches clavier */
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  buildDOM() {
    const dom = document.createElement("div");
    dom.classList.add("lightbox");
    dom.setAttribute("tabindex", "0");

    /* dom.innerHTML = `
        <button role="button" class="lightbox_close" aria-label="fermer le carroussel" ><i class="fa-solid fa-close fa-4x"></i></button>
        <button role="link" class="lightbox_next" aria-label="image suivante" ><i class="fa-solid fa-angle-right fa-4x"></i></button>
        <button role="link" class="lightbox_previous" aria-label="image précédente" ><i class="fa-solid fa-angle-left fa-4x"></i></button>
        <div class="lightbox_container"></div>`; */

    dom.innerHTML = `
        <div class="lightbox_with_nav">
        <div class="left_nav">
        <button role="link" class="lightbox_previous" aria-label="image précédente" ><i class="fa-solid fa-angle-left fa-4x"></i></button>
        </div>
        <div class="lightbox_container"></div>
        <div class="right_nav">
          <button role="button" class="lightbox_close" aria-label="fermer le carroussel" ><i class="fa-solid fa-close fa-4x"></i></button>
          <button role="link" class="lightbox_next" aria-label="image suivante" ><i class="fa-solid fa-angle-right fa-4x"></i></button>
        </div>
        </div>`;

    dom
      .querySelector(".lightbox_close")
      .addEventListener("click", this.close.bind(this));
    dom
      .querySelector(".lightbox_next")
      .addEventListener("click", this.next.bind(this));
    dom
      .querySelector(".lightbox_previous")
      .addEventListener("click", this.prev.bind(this));

    return dom;
  }

  /* Chargement d'une nouvelle image ou video dans la lightbox */
  loadImage(url) {
    this.url = url;
    const container = this.element.querySelector(".lightbox_container");
    container.innerHTML = "";

    let div = document.createElement("div");
    container.appendChild(div).classList.add("lightbox_container_media");
    let containerMedia = this.element.querySelector(
      ".lightbox_container_media"
    );

    const legend = document.createElement("h4");
    legend.innerHTML = url
      .split("/")
      [url.split("/").length - 1].split(".")[0]
      .replaceAll("_", " ");

    if (url.endsWith(".jpg")) {
      // image
      const image = new Image();
      containerMedia.appendChild(image);
      image.src = url;
      image.setAttribute("alt", legend.innerHTML);
      image.setAttribute("tabindex", "0");
      this.firstFocusableElement = image;
    } else if (url.endsWith(".mp4")) {
      //video
      const video = document.createElement("video");
      containerMedia.appendChild(video);
      video.setAttribute("controls", "");
      video.setAttribute("autoplay", "");
      video.src = url;
      video.setAttribute("aria-label", legend.innerHTML);
      video.setAttribute("tabindex", "0");
      this.firstFocusableElement = video;
    }

    // Element legende sous image ou video
    containerMedia.appendChild(legend);
  }

  /* Initialisation des elements focusables pour naviguer en boucle:
   *  	first -> image ou video
   *  	second -> suivante
   * 		third -> fermeture
   * 		last -> précédente
   */
  initFocus() {
    const focusableElements = document.querySelectorAll(".lightbox button");

    this.thirdFocusableElement = focusableElements[0];
    this.secondFocusableElement = focusableElements[1];
    this.lastFocusableElement = focusableElements[2];

    this.firstFocusableElement.focus();
  }

  /* Accessibilité avec aria-hidden pour ignorer le main ou la lightbox */
  ariaHide(hideLightbox) {
    const main = document.querySelector("main");
    const lightbox = document.querySelector(".lightbox");

    if (hideLightbox) {
      main.setAttribute("aria-hidden", false);
      lightbox.setAttribute("aria-hidden", true);
    } else {
      main.setAttribute("aria-hidden", true);
      lightbox.setAttribute("aria-hidden", false);
    }
  }

  /* Fermeture de la lightbox  */
  close(e) {
    e.preventDefault();

    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    this.ariaHide(true);
    this.element.classList.add("fadeout");
    window.setTimeout(() => {
      this.element.parentElement.removeChild(this.element), 500;
    });
    this.link.focus();
  }

  /* Navigation au clavier dans la galerie */

  /* Passer à l'image suivante de la galerie */
  next(e) {
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === this.images.length - 1) {
      i = -1;
    }
    this.loadImage(this.images[i + 1]);
    this.firstFocusableElement.focus();
  }

  /* Passer à l'image précédente de la galerie */
  prev(e) {
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === 0) {
      i = this.images.length;
    }
    this.loadImage(this.images[i - 1]);
    this.firstFocusableElement.focus();
  }

  /*
   - Gérer le focus tournant avec Tab et Shiftkey
   - Sortir du light box si 'Escape' au clavier
   - Passer à image ou video suivante ou précédente si 'ArrowRight' ou 'ArrowLeft'
   */
  onKeyDown(e) {
    e.preventDefault();
    let isTabPressed = e.key === "Tab";

    if (isTabPressed) {
      if (e.shiftKey) {
        // Si shift key pressé pour la combinaison shift + tab
        if (document.activeElement === this.firstFocusableElement) {
          this.lastFocusableElement.focus(); // on met le focus sur le dernier element focusable
        } else if (document.activeElement === this.lastFocusableElement) {
          this.thirdFocusableElement.focus();
        } else if (document.activeElement === this.secondFocusableElement) {
          this.firstFocusableElement.focus();
        } else if (document.activeElement === this.thirdFocusableElement) {
          this.secondFocusableElement.focus();
        }
      } else {
        // Sinon TabPressed seul
        if (document.activeElement === this.lastFocusableElement) {
          // Si on arrive au dernier element focusable, alors on remet le focus sur le premier
          this.firstFocusableElement.focus();
        } else if (document.activeElement === this.firstFocusableElement) {
          this.secondFocusableElement.focus();
        } else if (document.activeElement === this.secondFocusableElement) {
          this.thirdFocusableElement.focus();
        } else if (document.activeElement === this.thirdFocusableElement) {
          this.lastFocusableElement.focus();
        }
      }
    }
  }

  /**
   - Sortir du light box si 'Escape' ou 'Enter' sur closeButton au clavier
   - Passer à image ou video suivante ou précédente si 'ArrowRight' ou 'ArrowLeft'
   */
  onKeyUp(e) {
    //	e.preventDefault();

    switch (e.key) {
      case "Escape":
        this.close(e);
        break;
      case "ArrowRight":
        this.next(e);
        break;
      case "ArrowLeft":
        this.prev(e);
        break;
      case "Enter":
        if (document.activeElement === this.thirdFocusableElement) {
          this.close(e);
        } else if (document.activeElement === this.secondFocusableElement) {
          this.next(e);
        } else if (document.activeElement === this.lastFocusableElement) {
          this.prev(e);
        }
        break;
      default:
    }
  }
}
