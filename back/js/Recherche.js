window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer 20 marque
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_onduleur&random=true&limit=20',
         displayInstallationMarqueOnduleurs,
        null
    );
});
window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer 20 marque
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_panneau&random=true&limit=20',
         displayInstallationMarquePanneaux,
        null
    );
});
window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer 20 marque
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Departement&random=true&limit=20',
         displayDepartement,
        null
    );
});
window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer 20 marque
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Departement&random=true&limit=20',
         displayDepartement,
        null
    );
});

window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer 20 marque
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation&Marque_onduleur&Marque_panneau&Departement&limit=100',
         displaySearsh,
        null
    );
});

function displayInstallationMarqueOnduleurs(datas){
    if (datas) {
        for(let data of datas)
        {
            document.querySelector("#selectOnduleur").innerHTML+=`<option id='${data.id}'>${data.nom_marque}</option>`;
        }

    } else {
        document.querySelector("#selectOnduleur").textContent = 'Erreur';
    }
}
function displayInstallationMarquePanneaux(datas){
    if (datas) {
        for(let data of datas)
        {
            document.querySelector("#selectPanneaux").innerHTML+=`<option id='${data.id}'>${data.nom_marque}</option>`;
        }

    } else {
        document.querySelector("selectPanneaux").textContent = 'Erreur';
    }
}
function displayDepartement(datas){
    if (datas) {
        for(let data of datas)
        {
            document.querySelector("#selectDepartement").innerHTML+=`<option id='${data.id}'>${data.dep_nom}</option>`;
        }

    } else {
        document.querySelector("#selectDepartement").textContent = 'Erreur';
    }
}
function displaySearsh(datas){
    if (datas) {
        for(let data of datas)
        {
            document.querySelector("#selectDepartement").innerHTML+=`<tr>
            <td>${data}/${data}</td>
            <td>${data}</td>
            <td>${data}</td>
            <td>${data}</td>
            <td>${data}</td>
          </tr>
          <tr class="table-secondary">
            <td colspan="5"><a href="#">Cliquez ici pour voir les détails de cette installation</a></td>
          </tr>`;
        }

    } else {
        document.querySelector("#selectDepartement").textContent = 'Erreur';
    }

}