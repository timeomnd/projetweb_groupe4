'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (!data) return;

    let installation;
    try {
        installation = JSON.parse(data);
    } catch (e) {
        console.error("Erreur lors du parsing JSON:", e);
        return;
    }

    const colLeft = document.querySelectorAll('.row .col-md-6')[0];
    const colRight = document.querySelectorAll('.row .col-md-6')[1];

    if (!colLeft || !colRight) {
        console.warn("Structure HTML manquante");
        return;
    }

    colLeft.innerHTML = `
        <p><strong>Année de l'installation :</strong> ${installation.an_installation}</p>
        <p><strong>Mois de l'installation :</strong> ${installation.mois_installation}</p>
        <p><strong>Nombre onduleur :</strong> ${installation.nb_onduleur}</p>
        <p><strong>Nombre panneaux :</strong> ${installation.nb_panneaux}</p>
        <p><strong>Pente :</strong> ${installation.pente}</p>
        <p><strong>Pente optimum :</strong> ${installation.pente_optimum}</p>
    `;

    colRight.innerHTML = `
        <p><strong>Orientation :</strong> ${installation.orientation}</p>
        <p><strong>Orientation optimum :</strong> ${installation.orientation_optimum}</p>
        <p><strong>Surface :</strong> ${installation.surface}</p>
        <p><strong>Production pvgis :</strong> ${installation.production_pvgis}</p>
        <p><strong>Puissance crête :</strong> ${installation.puissance_crete}</p>
    `;
});
