document.addEventListener("DOMContentLoaded", () => {
  // Crée la carte centrée sur Paris
  const map = L.map('map').setView([48.8566, 2.3522], 13);

  // Ajoute les tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Exemple : ajouter un marqueur
  L.marker([48.8566, 2.3522]).addTo(map)
    .bindPopup('Paris')
    .openPopup();
});