document.addEventListener("DOMContentLoaded", () => {
  const mapImg = document.getElementById("map");

  if (mapImg) {
    console.log("JS chargé !");

    mapImg.addEventListener("mouseenter", () => {
      console.log("Survol !");
      mapImg.style.transform = "scale(1.2)";
      mapImg.style.transition = "transform 0.3s ease";
    });

    mapImg.addEventListener("mouseleave", () => {
      mapImg.style.transform = "scale(1)";
    });
  } else {
    console.warn("L'élément #map est introuvable !");
  }
});