'use strict';

window.addEventListener('DOMContentLoaded', () => {

    //Nombre d'installations
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation?count=true',
        displayInstallationCount,
        null
    );

    //Nombre de marques d'onduleurs,
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_onduleur?count=true',
        displayOnduleurMarqueCount,
        null
    );

    //Nombre de marques de panneaux
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_panneau?count=true',
        displayPanneauMarqueCount,
        null
    );


    //Nombre d'installateurs
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installateur?count=true',
        displayInstallateurCount,
        null
    );

    //Moyenne d'installations par an
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation?perYear=true',
        displayInstallationPerYear,
        null
    );


    //Moyenne d'installations par région
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation?perRegion=true',
        displayInstallationPerRegion,
        null
    )

    //Moyenne d'installations par région et par an
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation?perRegionPerYear=true',
        displayInstallationPerRegionPerYear,
        null
    );  

});







//CALLBACKS

function displayOnduleurMarqueCount(data){
    if ('count' in data) {
        document.querySelector('.marq-ond').textContent = data.count;
    } else {
        document.querySelector('.marq-ond').textContent = 'Erreur';
    }
}



function displayInstallationCount(data) {
    console.log('Réponse Installation:', data);
    if ('count' in data) {
        document.querySelector('.inst-recent').textContent = data.count;
    } else {
        document.querySelector('.inst-recent').textContent = 'Erreur';
    }
}   


function displayPanneauMarqueCount(data) {
    if ('count' in data) {
        document.querySelector('.marq-pan').textContent = data.count;
    } else {
        document.querySelector('.marq-pan').textContent = 'Erreur';
    }
}

function displayInstallateurCount(data) {
    if ('count' in data) {
        document.querySelector('.inst').textContent = data.count;
    } else {
        document.querySelector('.inst').textContent = 'Erreur';
    }
}


function displayInstallationPerYear(data) {
    if ('moyenne_installations_par_an' in data) {
        document.querySelector('.inst-an').textContent = data.moyenne_installations_par_an;
    } else {
        document.querySelector('.inst-an').textContent = 'Erreur';
    }
}

function displayInstallationPerRegion(data) {
    if (Array.isArray(data) && data.length > 0 && 'moyenne_installations_par_region' in data[0]) {
        document.querySelector('.inst-reg').textContent = data[0].moyenne_installations_par_region;
    } else {
        document.querySelector('.inst-reg').textContent = 'Erreur';
    }
}


function displayInstallationPerRegionPerYear(data) {
    if (Array.isArray(data) && data.length > 0 && 'moyenne_installations_globale' in data[0]) {
        document.querySelector('.inst-an-reg').textContent = data[0].moyenne_installations_globale;
    } else {
        document.querySelector('.inst-an-reg').textContent = 'Erreur';
    }
}



