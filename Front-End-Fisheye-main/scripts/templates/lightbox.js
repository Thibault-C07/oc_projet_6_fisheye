class Lightbox {
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
        console.log("click");
        new Lightbox(e.currentTarget.getAttribute("src"), images);
      })
    );

    // listener sur touche enter pour lancer la lightbox
    links.forEach((link) =>
      link.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key == "Enter") {
          new Lightbox(e.currentTarget.getAttribute("src"), images);
        }
        return;
      })
    );
  }

  constructor(url, images) {
    this.element = this.buildDOM();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.images = images;
    this.loadImage(url);
    document.body.appendChild(this.element);
    this.initFocus();
    document.addEventListener("keydown", this.onKeyDown);
  }

  buildDOM() {
    const dom = document.createElement("div");
    dom.classList.add("lightbox");
    dom.setAttribute("tabindex", "0");

    dom.innerHTML = `
        <button class="lightbox_close" aria-label="fermer le carroussel" ></button>
        <button class="lightbox_next" aria-label="image suivante" ></button>
        <button class="lightbox_previous" aria-label="image précédente" ></button>
        <div class="lightbox_container" role="document" aria-label=""></div>`;

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

  loadImage(url) {
    this.url = url;
    const container = this.element.querySelector(".lightbox_container");
    container.innerHTML = "";
    const legend = document.createElement("p");
    legend.innerHTML = url
      .split("/")
      [url.split("/").length - 1].split(".")[0]
      .replaceAll("_", " ");

    if (url.endsWith(".jpg")) {
      // image
      const image = new Image();
      container.appendChild(image);
      image.src = url;
    } else if (url.endsWith(".mp4")) {
      //video
      const video = document.createElement("video");
      container.appendChild(video);
      video.setAttribute("controls", "");
      video.src = url;
    }

    // Element legende sous image ou video
    container.appendChild(legend);
  }

  initFocus() {
    const focusableElements = document.querySelectorAll(".lightbox button");

    this.firstFocusableElement = focusableElements[0];
    this.secondFocusableElement = focusableElements[1];
    this.lastFocusableElement = focusableElements[2];

    this.firstFocusableElement.focus();
  }

  close(e) {
    e.preventDefault();
    this.element.classList.add("fadeout");
    window.setTimeout(() => {
      this.element.parentElement.removeChild(this.element), 500;
    });
    document.removeEventListener("keydown", this.onKeyDown);
  }

  next(e) {
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === this.images.length - 1) {
      i = -1;
    }
    this.loadImage(this.images[i + 1]);
  }

  prev(e) {
    e.preventDefault();
    let i = this.images.findIndex((image) => image === this.url);
    if (i === 0) {
      i = this.images.length;
    }
    this.loadImage(this.images[i - 1]);
  }

  onKeyDown(e) {
    e.preventDefault();
    let isTabPressed = e.key === "Tab";

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
        if (document.activeElement === this.firstFocusableElement) {
          this.close(e);
        } else if (document.activeElement === this.secondFocusableElement) {
          this.next(e);
        } else if (document.activeElement === this.lastFocusableElement) {
          this.prev(e);
        }
        break;
      default:
        if (isTabPressed) {
          if (e.shiftKey) {
            // Si shift key pressé pour la combinaison shift + tab
            if (document.activeElement === this.firstFocusableElement) {
              this.lastFocusableElement.focus(); // on met le focus sur le dernier element focusable
            } else if (document.activeElement === this.lastFocusableElement) {
              this.secondFocusableElement.focus();
            } else if (document.activeElement === this.secondFocusableElement) {
              this.firstFocusableElement.focus();
            }
          } else {
            // Sinon
            if (document.activeElement === this.lastFocusableElement) {
              // Si on arrive au dernier element focusable, alors on remet le focus sur le premier
              this.firstFocusableElement.focus();
            } else if (document.activeElement === this.firstFocusableElement) {
              this.secondFocusableElement.focus();
            } else if (document.activeElement === this.secondFocusableElement) {
              this.lastFocusableElement.focus();
            }
          }
        }
    }
  }
}
