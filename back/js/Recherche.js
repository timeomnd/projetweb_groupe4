 // chargement des données pour remplire les select de manier random
 window.addEventListener('DOMContentLoaded', () => {
    ajaxRequest('GET', 'http://10.10.51.124/back/Marque_onduleur&random=true&limit=20', displayInstallationMarqueOnduleurs, null);
    ajaxRequest('GET', 'http://10.10.51.124/back/Marque_panneau&random=true&limit=20', displayInstallationMarquePanneaux, null);
    ajaxRequest('GET', 'http://10.10.51.124/back/Departement&random=true&limit=20', displayDepartement, null);
    ajaxRequest('GET', 'http://10.10.51.124/back/Installation?marque_panneau&marque_onduleur&departement', displaySearch, null);

    const btn = document.querySelector("#button");
    if (btn) {
        btn.addEventListener('click', () => {
            let marq_onduleur = document.querySelector("#selectOnduleur").selectedOptions[0].text;
            let marq_panneau = document.querySelector("#selectPanneaux").selectedOptions[0].text;
            let departement = document.querySelector("#selectDepartement").selectedOptions[0].text;

            console.log(marq_onduleur, marq_panneau, departement);

            ajaxRequest(
                'GET',
                `http://10.10.51.124/back/Installation?Marque_panneau=${encodeURIComponent(marq_panneau)}&Marque_onduleur=${encodeURIComponent(marq_onduleur)}&Departement=${encodeURIComponent(departement)}`,
                displaySearch,
                null
            );
        });
    } else {
        console.error("Bouton '#button' non trouvé dans le DOM");
    }
});


function displayInstallationMarqueOnduleurs(datas){
    const select = document.querySelector("#selectOnduleur");
    if (datas) {
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
        for (let data of datas) {
            select.innerHTML += `<option value='${data.id}'>${data.dep_nom}</option>`;
        }
    } else {
        select.textContent = 'Erreur';
    }
}


function displaySearch(datas){
    const tableBody = document.querySelector("#installationTableBody"); 
    if (datas) {
        for (let data of datas) {
            tableBody.innerHTML += `
                <tr>
                    <td>${data.mois_installation}/${data.an_installation}</td>
                    <td>${data.nb_panneaux}</td>
                    <td>${data.surface}</td>
                    <td>${data.puissance_crete}</td>
                    <td>lon = ${data.lo}, lat:${data.lat}</td>
                </tr>
                <tr class="table-secondary">
                    <td colspan="5"><a href="detail.html">Cliquez ici pour voir les détails de cette installation</a></td>
                </tr>
            `;
        }
    } else {
        tableBody.innerHTML = '<tr><td colspan="5">Erreur</td></tr>';
    }
}
