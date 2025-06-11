'use strict';

//------------------------------------------------------------------------------
//--- ajaxRequest --------------------------------------------------------------
//------------------------------------------------------------------------------
// Effectue une requête Ajax.
// \param type Le type de la requête (GET, DELETE, POST, PUT).
// \param url L'URL vers laquelle envoyer les données.
// \param callback La fonction à appeler lorsque la requête réussit.
// \param data Les données associées à la requête.
function ajaxRequest(type, url, callback, data = null)
{
    let xhr;

    // Création de l'objet XMLHttpRequest.
    xhr = new XMLHttpRequest();
    if (type == 'GET' && data != null)
        url += '?' + data;

    xhr.open(type, url); 

    // Pour POST/PATCH, envoie des données en JSON
    if (type === 'POST' || type === 'PATCH') {
        xhr.setRequestHeader('Content-Type', 'application/json');
    } else {
        // Pour GET/DELETE
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    // Ajout de la fonction à exécuter lors du chargement.
    xhr.onload = () =>
    {
        switch (xhr.status)
        {
            case 200:
            case 201:
                console.log(xhr.responseText);
                callback(JSON.parse(xhr.responseText));
                break;
            default:
                httpErrors(xhr.status);
        }
    };

    // Envoi de la requête XMLHttpRequest.
    if (type === 'POST' || type === 'PUT' || type === 'PATCH') {
        xhr.send(data ? JSON.stringify(data) : null);
    } else {
        xhr.send();
    }
}

//------------------------------------------------------------------------------
//--- httpErrors ---------------------------------------------------------------
//------------------------------------------------------------------------------
// Affiche un message d'erreur en fonction d'un code d'erreur HTTP.
// \param errorCode Le code d'erreur (code de statut HTTP par exemple).
function httpErrors(errorCode)
{
    let messages =
        {
            400: 'Requête incorrecte',
            401: 'Authentifiez-vous',
            403: 'Accès refusé',
            404: 'Page non trouvée',
            500: 'Erreur interne du serveur',
            503: 'Service indisponible'
        };

    // Affichage du message d'erreur.

    const errorsElement = document.getElementById('errors');
    if (errorsElement && messages[errorCode]) {
        errorsElement.innerHTML = '<i class="fa fa-exclamation-circle"></i> <strong>' + messages[errorCode] + '</strong>';
        errorsElement.style.display = 'block';
    }

    console.error('Erreur HTTP ' + errorCode + ' : ' + (messages[errorCode] || 'Erreur inconnue'));
}
