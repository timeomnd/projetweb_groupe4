'use strict';

window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer le nombre total d'installations
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Departement&random=true&limit=20',
        displayDepartementRandomListLimit20,
        null
    );
    ajaxRequest(
        'GET',
        'http://10.10.51.124/back/Installation?years',
        displayInstallationYears,
        null
    );
    document.getElementById('btnRecherche').addEventListener('click', (event) => {
        event.preventDefault(); // empêche le rechargement du formulaire

        const dep = document.getElementById('selectDepartement').value;
        const an = document.getElementById('selectAnInstallation').value;

        if (!dep || !an) {
            alert("Veuillez choisir un département et une année.");
            return;
        }

        const url = `http://10.10.51.124/back/Localisation&departement=${encodeURIComponent(dep)}&an=${an}`;

        ajaxRequest(
            'GET',
            url,
            displayMapMarkers, // callback de traitement des coordonnées
            null
        );
    });
});

//CALLBACKS

function displayDepartementRandomListLimit20(data) {
    const select = document.getElementById('selectDepartement');

    // On vide d'abord les anciennes options sauf la première (disabled)
    select.innerHTML = '<option selected disabled>Choisir un Département</option>';

    // Parcourt les départements reçus et ajoute une option pour chacun
    data.forEach(dep => {
        const option = document.createElement('option');
        option.value = dep.dep_nom;
        option.textContent = dep.dep_nom;
        select.appendChild(option);
    });
}
function displayInstallationYears(data) {
    console.log(data);
    const select = document.getElementById('selectAnInstallation');

    // Réinitialise le select avec l’option par défaut
    select.innerHTML = '<option selected disabled>Choisir une année d\'installation</option>';

    // Ajoute chaque année (elles sont déjà uniques et triées)
    data.forEach(annee => {
        if (annee) {
            const option = document.createElement('option');
            option.value = annee;
            option.textContent = annee;
            select.appendChild(option);
        }
    });
}

function displayInstallationsOnMap(data) {
  // Supprime les anciens marqueurs
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Ajoute un marqueur pour chaque point
  data.forEach(item => {
    const lat = item.lat;
    const lon = item.lon;

    if (lat && lon) {
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`Lat: ${lat}<br>Lon: ${lon}`);
    }
  });
}
