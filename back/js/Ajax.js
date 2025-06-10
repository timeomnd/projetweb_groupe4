
'use strict';

//------------------------------------------------------------------------------
//--- ajaxRequest --------------------------------------------------------------
//------------------------------------------------------------------------------
// Perform an Ajax request.
// \param type The type of the request (GET, DELETE, POST, PUT).
// \param url The url with the data.
// \param callback The callback to call where the request is successful.
// \param data The data associated with the request.
function ajaxRequest(type, url, callback, data = null)
{
    let xhr;

    // Create XML HTTP request.
    xhr = new XMLHttpRequest();
    if (type == 'GET' && data != null)
        url += '?' + data;

    xhr.open(type, url); 
 

    // Pour POST/PATCH, envoie du JSON
    if (type === 'POST' || type === 'PATCH') {
        xhr.setRequestHeader('Content-Type', 'application/json');
    } else {
        //GET/DELETE
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    // Add the onload function.
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

    // Send XML HTTP request.
     if (type === 'POST' || type === 'PUT' || type === 'PATCH') {
        xhr.send(data ? JSON.stringify(data) : null);
    } else {
        xhr.send();
    }
}

//------------------------------------------------------------------------------
//--- httpErrors ---------------------------------------------------------------
//------------------------------------------------------------------------------
// Display an error message accordingly to an error code.
// \param errorCode The error code (HTTP status for example).
function httpErrors(errorCode)
{
    let messages =
        {
            400: 'Requête incorrecte',
            401: 'Authentifiez vous',
            403: 'Accès refusé',
            404: 'Page non trouvée',
            500: 'Erreur interne du serveur',
            503: 'Service indisponible'
        };

    // Display error.

    const errorsElement = document.getElementById('errors');
    if (errorsElement && messages[errorCode]) {
        errorsElement.innerHTML = '<i class="fa fa-exclamation-circle"></i> <strong>' + messages[errorCode] + '</strong>';
        errorsElement.style.display = 'block';
    }

    console.error('Erreur HTTP ' + errorCode + ' : ' + (messages[errorCode] || 'Erreur inconnue'));
}
