class Photographer {
  constructor(data) {
    this._name = data.name;
    this._id = data.id;
    this._city = data.city;
    this._country = data.country;
    this._tagline = data.tagline;
    this._price = data.price;
    this._picture = data.portrait;
  }

  get location() {
    return `${this._city}, ${this._country}`;
  }

  get picture() {
    return `assets/photographers/${this._picture}`;
  }

  get userTitle() {
    return ` - ${this._name}`;
  }

  get userCardDOM() {
    return `
      <a href="/photographer.html?id=${this._id}" class="photographer_focus" aria-label="présentation du photographe ${this._name}">
        <article>
          <img src="assets/photographers/${this._picture}" alt="le photographe ${this._name}"></img>
          <h2>${this._name}</h2>
          <p class="location">${this.location}</p>
          <p class="tagline">${this._tagline}</p>
          <p class="price">${this._price}€/jour</p>
        </article>
      </a>
       `;
  }

  get userData() {
    return `
      <div class="sumup">
        <h2>${this._name}</h2>
        <p class="location">${this.location}</p>
        <p class="tagline">${this._tagline}</p>
      </div>
      <div class="contact">
        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
      </div>
      <img src="assets/photographers/${this._picture}" alt="le photographe ${this._name}"></img>
     `;
  }
}
