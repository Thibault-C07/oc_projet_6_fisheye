/* Récupération des données du fichier json par un fetch */
export function getPhotographers() {
  return fetch("./data/photographers.json")
    .then((response) => response.json())
    .catch((err) => {
      throw `la requete API fetch a échoué: ${err}`;
    });
}
