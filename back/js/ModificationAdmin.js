function fetchInstallation() {
    const id = document.getElementById('installId').value.trim();

    if (!id) {
        alert("Veuillez entrer un ID.");
        return;
    }

    ajaxRequest(
        'GET',
        `http://10.10.51.124/back/Installation/${id}`, // ici l'ID est dans l'URL
        displayInstallation,
        null
    );
}

function displayInstallation(data) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // vide le tableau avant ajout

    if (!data || data.error) {
        tbody.innerHTML = '<tr><td colspan="15" class="text-danger">Installation introuvable avec cet ID</td></tr>';
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.mois}</td>
        <td>${data.annee}</td>
        <td>${data.nb_panneaux}</td>
        <td>${data.nb_onduleurs}</td>
        <td>${data.pente}</td>
        <td>${data.pente_opt}</td>
        <td>${data.surface}</td>
        <td>${data.production_pvgs}</td>
        <td>${data.puissance}</td>
        <td>${data.commune || data.nom_commune || data.id_commune}</td>
        <td>${data.id_localisation}</td>
        <td>${data.id_panneau}</td>
        <td>${data.id_onduleur}</td>
        <td>${data.id_installateur}</td>
    `;
    tbody.appendChild(row);
}
