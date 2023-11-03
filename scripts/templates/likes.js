/* Initialisation des listeners sur les coeurs des images et videos avec incrémentation des coeurs */

export class Likes {
  static init() {
    const likesIcon = document.querySelectorAll(".likesSection button");
    let totalLikes = document.getElementById("totalLikes");

    /* Fonction de Mise à jour des likes */
    function updateLikes(link, totalLikes) {
      if (link.classList[0] === "likeIcon") {
        link.classList.remove("likeIcon");
        --link.parentElement.childNodes[1].innerHTML;
        --totalLikes.innerHTML;
        link.setAttribute("aria-label", "J'aime pas");
      } else {
        link.classList.add("likeIcon");
        ++link.parentElement.childNodes[1].innerHTML;
        ++totalLikes.innerHTML;
        link.setAttribute("aria-label", "J'aime");
      }
    }

    // Listener sur clic du coeur pour ajouter un j'aime ou un j'aime pas
    likesIcon.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        updateLikes(link, totalLikes);
      })
    );
  }
}
