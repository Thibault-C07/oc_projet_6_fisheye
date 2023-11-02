class Lightbox {
  static init() {
    const gallerySection = document.querySelector(".photograph-gallery");
    const links = Array.from(
      gallerySection.querySelectorAll('img[src$=".jpg"], video[src$=".mp4"]')
    );
    const images = links.map((link) => link.getAttribute("src"));
    links.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        new Lightbox(
          e.currentTarget.getAttribute("src"),
          e.currentTarget.getAttribute("alt"),
          images
        );
      })
    );
  }

  constructor(url, alt, images) {
    this.element = this.buildDOM();
    this.onKeyUp = this.onKeyUp.bind(this);
    this.images = images;
    this.loadImage(url);
    document.body.appendChild(this.element);
    document.addEventListener("keyup", this.onKeyUp);
  }

  buildDOM() {
    const dom = document.createElement("div");
    dom.classList.add("lightbox");

    dom.innerHTML = `
          <button class="lightbox_close" aria-label="fermer le carroussel"></button>
          <button class="lightbox_next" aria-label="image suivante"></button>
          <button class="lightbox_previous" aria-label="image précédente"></button>
          <div class="lightbox_container"></div>`;

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
    this.url = null;
    const image = new Image();
    const container = this.element.querySelector(".lightbox_container");
    container.innerHTML = "";
    const legend = document.createElement("p");
    legend.innerHTML = url
      .split("/")
      [url.split("/").length - 1].split(".")[0]
      .replace("_", " ");
    container.appendChild(image);
    container.appendChild(legend);
    this.url = url;
    image.src = url;
  }

  close(e) {
    e.preventDefault();
    this.element.classList.add("fadeout");
    window.setTimeout(() => {
      this.element.parentElement.removeChild(this.element), 500;
    });
    document.removeEventListener("keyup", this.onKeyUp);
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

  onKeyUp(e) {
    if (e.key == "Escape") {
      this.close(e);
    }
  }
}
