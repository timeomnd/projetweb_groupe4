'use strict';

window.addEventListener('DOMContentLoaded', () => {
    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation&count=true',
        displayInstallationCount,
        null
    );

    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_onduleur&count=true',
        displayOnduleurMarqueCount,
        null
    );

      ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Marque_panneau&count=true',
        displayPanneauMarqueCount,
        null
    );

     ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installateur&count=true',
        displayInstallateurCount,
        null
    );

    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation&perYear=true',
        displayInstallationPerYear,
        null
    );

    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation&perRegion=true',
        displayInstallationPerRegion,
        null
    )

    ajaxRequest(    
        'GET',
        'http://10.10.51.124/back/Installation&perRegionPerYear=true',
        displayInstallationPerRegionPerYear,
        null
    );  

   




});







//CALLBACKS

function displayOnduleurMarqueCount(data){
    if ('count' in data) {
        document.querySelector('#nb-onduleurs').textContent = data.count;
    } else {
        document.querySelector('#nb-onduleurs').textContent = 'Erreur';
    }
}



function displayInstallationCount(data) {
    if ('count' in data) {
        document.querySelector('#total-enregistrements').textContent = data.count;
    } else {
        document.querySelector('#total-enregistrements').textContent = 'Erreur';
    }
}   


function displayPanneauMarqueCount(data) {
    if ('count' in data) {
        document.querySelector('#nb-panneaux').textContent = data.count;
    } else {
        document.querySelector('#nb-panneaux').textContent = 'Erreur';
    }
}

function displayInstallateurCount(data) {
    if ('count' in data) {
        document.querySelector('#nb-installateurs').textContent = data.count;
    } else {
        document.querySelector('#nb-installateurs').textContent = 'Erreur';
    }
}


function displayInstallationPerYear(data) {
    if ('moyenne_installations_par_an' in data) {
        document.querySelector('#installations-annee').textContent = data.moyenne_installations_par_an;
    } else {
        document.querySelector('#installations-annee').textContent = 'Erreur';
    }
}

function displayInstallationPerRegion(data) {
    if (Array.isArray(data) && data.length > 0 && 'moyenne_installations_par_region' in data[0]) {
        document.querySelector('#installations-region').textContent = data[0].moyenne_installations_par_region;
    } else {
        document.querySelector('#installations-region').textContent = 'Erreur';
    }
}


function displayInstallationPerRegionPerYear(data) {
    if (Array.isArray(data) && data.length > 0 && 'moyenne_installations_globale' in data[0]) {
        document.querySelector('#installations-annee-region').textContent = data[0].moyenne_installations_globale;
    } else {
        document.querySelector('#installations-annee-region').textContent = 'Erreur';
    }
}


