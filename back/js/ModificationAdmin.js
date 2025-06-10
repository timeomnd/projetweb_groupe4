window.addEventListener('DOMContentLoaded', () => {
    ajaxRequest('GET', 'http://10.10.51.124/back/Installation', displayInstallation, null);
});

function displayInstallation(datas) {
    const tbody = document.querySelector('tbody');
    
    // On prépare toutes les lignes dans une variable avant de les insérer
    let rowsHTML = '';
    
    for(let data of datas) {
        rowsHTML += `<tr>
            <td>${data.id}</td>
            <td>${data.an_installation}</td>
            <td>${data.nb_panneaux}</td>
            <td>${data.nb_onduleur}</td>
            <td>${data.pente}</td> 
            <td>${data.pente_optimum}</td>
            <td>${data.surface}</td>
            <td>${data.production_pvgis}</td>
            <td>${data.puissance_crete}</td>
            <td>
                <button class="btn btn-warning btn-sm">Modifier</button>
                <button class="btn btn-danger btn-sm">Supprimer</button>
            </td>
        </tr>`;
    }
    
    // On insère toutes les lignes en une seule opération
    tbody.innerHTML = rowsHTML;
}