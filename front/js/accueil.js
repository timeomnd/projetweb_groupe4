document.addEventListener("DOMContentLoaded", () => {
  const mapElements = document.querySelectorAll(".map");

  if (mapElements.length > 0) {
    console.log("JS chargé :", mapElements.length, "éléments trouvés");

    mapElements.forEach((element) => {
      // Ajoute une transition une seule fois
      element.style.transition = "transform 0.3s ease";

      element.addEventListener("mouseenter", () => {
        console.log("Survol !");
        element.style.transform = "scale(1.1)";
        element.style.backgroundColor = "Rgba(255, 255, 255, 0.5)";
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "scale(1)";
        element.style.backgroundColor = "Rgba(255, 255, 255)";
      }); 
    });
  } else {
    console.warn("Aucun élément avec la classe .map trouvé !");
  }
});

