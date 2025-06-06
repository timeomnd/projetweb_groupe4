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


//ajaxRequest(
      //  'GET',
       // 'http://10.10.51.124/back/Localisation&departement=&an=$année
   // )

   // mettre année = et département = dans l'url avec les trucs rentré dans le select