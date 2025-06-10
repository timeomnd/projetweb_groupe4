window.addEventListener('DOMContentLoaded', () => {
    const buttonValider = document.getElementById('buttonValider');
    const input = document.getElementById('dataInput');

    buttonValider.addEventListener('click', (e) => {
        e.preventDefault();
        const limit = input.value || 100;
        ajaxRequest('GET', `http://10.10.51.124/back/Installation?perNumber=true&limit=${limit}`, displayInstallation);
    });

    // Chargement initial avec la valeur par défaut
    const defaultLimit = input.value || 100;
    ajaxRequest('GET', `http://10.10.51.124/back/Installation?perNumber=true&limit=${defaultLimit}`, displayInstallation);
});

function displayInstallation(datas) {
    const tbody = document.querySelector('tbody');
    let rowsHTML = '';

    for (let data of datas) {
        // On encode les infos de l'installation en JSON puis en URI
        const dataParam = encodeURIComponent(JSON.stringify(data));
        rowsHTML += `
            <tr>
              <td>${data.mois_installation}/${data.an_installation}</td>
              <td>${data.nb_panneaux}</td>
              <td>${data.surface} m²</td>
              <td>${data.puissance_crete} kWc</td>
              <td>${data.nom_standard}</td>
              <td>
                <a href="../../../front/html/User/detail.html?data=${dataParam}" class="btn btn-sm btn-outline-primary blue">Plus</a>
              </td>
            </tr>
        `;
    }

    tbody.innerHTML = rowsHTML;
}
