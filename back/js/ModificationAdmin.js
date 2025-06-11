'use strict';

let currentPage = 1;
const resultsPerPage = 50;

window.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayInstallations();

    // Modales et variables communes
    const deleteModal = document.getElementById('delete-modal');
    const confirmBtnDelete = document.getElementById('confirm-delete-btn');
    const cancelBtnDelete = document.getElementById('cancel-delete-btn');
    let idToDelete = null;

    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    let idToEdit = null;

    // Délégation d'événement pour les boutons Modifier et Supprimer
    document.body.addEventListener('click', function(e) {
        // Suppression
        if (e.target && e.target.classList.contains('btn-supprimer')) {
            idToDelete = e.target.getAttribute('data-id'); //On récupère l'id de l'installation à supprimer (voir dans le HTML plus loin l'attribut data-id) 
            if (idToDelete) deleteModal.style.display = 'flex';
        }
        // Modification
        if (e.target && e.target.classList.contains('btn-modifier')) {
            idToEdit = e.target.getAttribute('data-id');
            // Vide les champs à chaque ouverture
            Array.from(editForm.elements).forEach(input => input.value = '');
            editModal.style.display = 'flex';
        }
    });

    // Validation suppression
    if (confirmBtnDelete) {
        confirmBtnDelete.addEventListener('click', function() {
            if (idToDelete) {
                ajaxRequest(
                    'DELETE',
                    `http://10.10.51.124/back/Installation/${idToDelete}`,
                    () => {
                        deleteModal.style.display = 'none';
                        idToDelete = null;
                        alert("Installation supprimée avec succès.");
                        fetchAndDisplayInstallations(); //Pour rafraîchir la liste après suppression
                    }
                );
            }
        });
    }
    // Annulation suppression
    if (cancelBtnDelete) {
        cancelBtnDelete.addEventListener('click', function() {
            deleteModal.style.display = 'none';
            idToDelete = null;
        });
    }

    // Validation modification
    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!idToEdit) return;

            // Récupère les valeurs non vides uniquement
            const data = {};    
            const mois = editForm['edit-mois'].value;

             // Validation mois
            if (mois) {
                if (parseInt(mois) > 12 && parseInt(mois) < 1) {
                    alert("Le mois doit être inférieur ou égal à 12.");
                    return;
                }
                data.mois_installation = parseInt(mois);
            }


            
            
            if (editForm['edit-annee'].value) data.an_installation = parseInt(editForm['edit-annee'].value);
            if (editForm['edit-panneaux'].value) data.nb_panneaux = parseInt(editForm['edit-panneaux'].value);
            if (editForm['edit-onduleurs'].value) data.nb_onduleur = parseInt(editForm['edit-onduleurs'].value);
            if (editForm['edit-pente'].value) data.pente = parseFloat(editForm['edit-pente'].value);
            if (editForm['edit-pente_optimum'].value) data.pente_optimum = parseFloat(editForm['edit-pente_optimum'].value);
            if (editForm['edit-orientation'].value) data.orientation = editForm['edit-orientation'].value.trim();
            if (editForm['edit-orientation_opt'].value) data.orientation_optimum = editForm['edit-orientation_opt'].value.trim();
            if (editForm['edit-surface'].value) data.surface = parseFloat(editForm['edit-surface'].value);
            if (editForm['edit-production'].value) data.production_pvgis = parseFloat(editForm['edit-production'].value);
            if (editForm['edit-puissance'].value) data.puissance_crete = parseFloat(editForm['edit-puissance'].value);

            // Si aucun champ n'a été rempli dans le formulaire de modification,
            // on affiche une alerte et on empêche l'envoi de la requête PATCH.
            // Cela évite d'envoyer une modification vide au serveur.
            if (Object.keys(data).length === 0) {
                alert("Veuillez remplir au moins un champ à modifier.");
                return;
            }

            ajaxRequest(
                'PATCH',
                `http://10.10.51.124/back/Installation/${idToEdit}`,
                () => {
                    editModal.style.display = 'none';
                    idToEdit = null;
                    fetchAndDisplayInstallations();
                },
                data
            );
        });
    }
    // Annulation modification
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            editModal.style.display = 'none';
            idToEdit = null;
        });
    }
});

// Affiche la liste paginée des installations
function fetchAndDisplayInstallations() {
    let url = `http://10.10.51.124/back/Installation?page=${currentPage}&limit=${resultsPerPage}`;
    ajaxRequest('GET', url, displayInstallation, null);
}

// Affiche le tableau des installations
function displayInstallation(result) {
    let datas = result.data;
    let total = result.total;

    const tbody = document.querySelector('tbody');
    let rowsHTML = '';
    for (let data of datas) {
        rowsHTML += `<tr>
            <td>${data.id}</td>
            <td>${data.mois_installation}</td>
            <td>${data.an_installation}</td>
            <td>${data.nb_panneaux}</td>
            <td>${data.nb_onduleur}</td>
            <td>${data.pente}</td>
            <td>${data.pente_optimum}</td>
            <td>${data.orientation}</td>
            <td>${data.orientation_optimum}</td>
            <td>${data.surface}</td>
            <td>${data.production_pvgis}</td>
            <td>${data.puissance_crete}</td>
            <td>    
                 <!-- 
                On place l'id de l'installation dans un attribut data-id sur les boutons Modifier et Supprimer.
                Cet id n'est pas affiché à l'utilisateur, mais il est accessible en JS lors du clic sur ces boutons.
                Cela permet de savoir quelle installation modifier ou supprimer lors de la requête AJAX.
                -->

                <button class="btn btn-warning btn-sm btn-modifier" data-id="${data.id}">Modifier</button> 
                <button class="btn btn-danger btn-sm btn-supprimer" data-id="${data.id}">Supprimer</button>
            </td>
        </tr>`;
    }
    tbody.innerHTML = rowsHTML;

    displayPagination(total);
}

// Affiche la pagination
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