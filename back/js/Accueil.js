
'use strict';

window.addEventListener('DOMContentLoaded', () => {
    // Requête AJAX pour récupérer le nombre total d'installations
    ajaxRequest(
        'GET',
        'api.php?request=Installation&count=true',
        displayInstallationCount,
        null
    );
});

// Fonction callback appelée après la requête
function displayInstallationCount(data) {
    if ('count' in data) {
        document.getElementByClass('info-green inst-recent')[0].textContent = data.count;
    } else {
        document.getElementByClass('info-green inst-recent')[0].textContent = 'Erreur';
    }
}


