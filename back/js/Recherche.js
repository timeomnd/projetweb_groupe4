'use strict';

let currentPage = 1;
let currentFilters = {};
const resultsPerPage = 50;

// Chargement des données pour remplir les selects de manière random
window.addEventListener('DOMContentLoaded', () => {
    ajaxRequest('GET', 'http://10.10.51.124/back/Marque_onduleur?random=true&limit=20', displayInstallationMarqueOnduleurs, null);
    ajaxRequest('GET', 'http://10.10.51.124/back/Marque_panneau?random=true&limit=20', displayInstallationMarquePanneaux, null);
    ajaxRequest('GET', 'http://10.10.51.124/back/Departement?random=true&limit=20', displayDepartement, null);

    fetchAndDisplayInstallations();

    // Empêche le submit classique du formulaire et lance la recherche AJAX
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let marq_onduleur = document.querySelector("#selectOnduleur").selectedOptions[0]?.text;
            let marq_panneau = document.querySelector("#selectPanneaux").selectedOptions[0]?.text;
            let departement = document.querySelector("#selectDepartement").selectedOptions[0]?.text;

            // Réinitialise les filtres
            currentFilters = {};
            if (marq_onduleur && marq_onduleur !== "Choisir une marque") currentFilters.marque_onduleur = marq_onduleur;
            if (marq_panneau && marq_panneau !== "Choisir une marque") currentFilters.marque_panneau = marq_panneau;
            if (departement && departement !== "Choisir un département") currentFilters.departement = departement;

            currentPage = 1;
            fetchAndDisplayInstallations();
        });
    } else {
        console.error("Formulaire non trouvé dans le DOM");
    }
});

function fetchAndDisplayInstallations() {
    let url = `http://10.10.51.124/back/Installation?page=${currentPage}&limit=${resultsPerPage}`;
    if (currentFilters.marque_onduleur) url += `&marque_onduleur=${encodeURIComponent(currentFilters.marque_onduleur)}`;
    if (currentFilters.marque_panneau) url += `&marque_panneau=${encodeURIComponent(currentFilters.marque_panneau)}`;
    if (currentFilters.departement) url += `&departement=${encodeURIComponent(currentFilters.departement)}`;
    ajaxRequest('GET', url, displaySearch, null);
}

function displayInstallationMarqueOnduleurs(datas){
    const select = document.querySelector("#selectOnduleur");
    if (datas) {
        select.innerHTML = `<option selected disabled>Choisir une marque</option>`;
        for (let data of datas) {
            select.innerHTML += `<option value='${data.id}'>${data.nom_marque}</option>`;
        }
    } else {
        select.textContent = 'Erreur';
    }
}

function displayInstallationMarquePanneaux(datas){
    const select = document.querySelector("#selectPanneaux");
    if (datas) {
        select.innerHTML = `<option selected disabled>Choisir une marque</option>`;
        for (let data of datas) {
            select.innerHTML += `<option value='${data.id}'>${data.nom_marque}</option>`;
        }
    } else {
        select.textContent = 'Erreur';
    }
}

function displayDepartement(datas){
    const select = document.querySelector("#selectDepartement");
    if (datas) {
        select.innerHTML = `<option selected disabled>Choisir un département</option>`;
        for (let data of datas) {
            select.innerHTML += `<option value='${data.id}'>${data.dep_nom}</option>`;
        }
    } else {
        select.textContent = 'Erreur';
    }
}

function displaySearch(result){
    // result = { data: [...], total: ... }
    let datas = result.data;
    let total = result.total;

    let tableBody = document.querySelector("#installationTableBody");
    if (!tableBody) {
        const table = document.querySelector("table");
        tableBody = document.createElement("tbody");
        tableBody.id = "installationTableBody";
        table.appendChild(tableBody);
    }
    tableBody.innerHTML = "";

    if (datas && datas.length > 0) {
        for (let data of datas) {
            const dataEncoded = encodeURIComponent(JSON.stringify(data));
            tableBody.innerHTML += `
                <tr>
                    <td>${data.mois_installation}/${data.an_installation}</td>
                    <td>${data.nb_panneaux}</td>
                    <td>${data.surface}</td>
                    <td>${data.puissance_crete}</td>
                    <td>${data.nom_standard ?? ''}</td>
                </tr>
                <tr class="table-secondary">
                    <td colspan="5">
                        <a href="../../../front/html/User/detail.html?data=${dataEncoded}">
                            Cliquez ici pour voir les détails de cette installation
                        </a>
                    </td>
                </tr>
            `;
        }
    } else {
        tableBody.innerHTML = '<tr><td colspan="5">Aucun résultat</td></tr>';
    }
    displayPagination(total);
}

function displayPagination(total) {
    const pagination = document.querySelector(".pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    const totalPages = Math.ceil(total / resultsPerPage);
    if (totalPages <= 1) return;

    // Previous
    pagination.innerHTML += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>`;

    let pages = [];

    // Toujours les 3 premières pages
    for (let i = 1; i <= Math.min(3, totalPages); i++) pages.push(i);

    // Pages autour de la courante (sauf si déjà dans les 3 premières ou 3 dernières)
    let start = Math.max(4, currentPage - 1);
    let end = Math.min(totalPages - 3, currentPage + 1);

    if (start > 4) pages.push('...');
    for (let i = start; i <= end; i++) {
        if (i > 3 && i < totalPages - 2) pages.push(i);
    }
    if (end < totalPages - 3) pages.push('...');

    // Toujours les 3 dernières pages
    for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
        if (i > 3) pages.push(i);
    }

    // Supprime les doublons tout en gardant l'ordre
    pages = pages.filter((v, i, arr) => v === '...' || arr.indexOf(v) === i);

    // Affichage des pages
    pages.forEach(page => {
        if (page === '...') {
            pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        } else {
            pagination.innerHTML += `<li class="page-item${page === currentPage ? ' active' : ''}">
                <a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
        }
    });

    // Next
    pagination.innerHTML += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`;

    // Ajoute les listeners
    pagination.querySelectorAll("a.page-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = parseInt(link.getAttribute("data-page"));
            if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                currentPage = page;
                fetchAndDisplayInstallations();
            }
        });
    });
}