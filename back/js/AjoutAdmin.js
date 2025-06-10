const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // empêche le rechargement de la page

    // Récupération des champs 
    // Champs numériques 
    let mois_installation = parseInt(document.getElementById('mois').value);
    let an_installation = parseInt(document.getElementById('annee').value);
    let nb_panneaux = parseInt(document.getElementById('panneaux').value);
    let nb_onduleur = parseInt(document.getElementById('onduleurs').value);
    let pente = parseFloat(document.getElementById('pente').value);
    let pente_optimum = parseFloat(document.getElementById('pente_optimum').value);
    let surface = parseFloat(document.getElementById('surface').value);
    let production_pvgis = parseFloat(document.getElementById('production').value);
    let puissance_crete = parseFloat(document.getElementById('puissance').value);
    let id_Localisation = parseInt(document.getElementById('id_localisation').value);
    let id_Panneau = parseInt(document.getElementById('id_panneau').value);
    let id_Onduleur = parseInt(document.getElementById('id_onduleur').value);
    let id_Installateur = parseInt(document.getElementById('id_installateur').value);

    
    // Champs pouvant être textuels
    let orientation = document.getElementById('orientation').value.trim();
    let orientation_optimum = document.getElementById('orientation_opt').value.trim();

    // Vérifie que tous les champs sont remplis et valides
    if (
        isNaN(mois_installation) || mois_installation < 1 || mois_installation > 12 ||
        isNaN(an_installation) || isNaN(nb_panneaux) || isNaN(nb_onduleur) ||
        isNaN(pente) || isNaN(pente_optimum) || isNaN(surface) ||
        isNaN(production_pvgis) || isNaN(puissance_crete) ||
        isNaN(id_Localisation) || isNaN(id_Panneau) || isNaN(id_Onduleur) || isNaN(id_Installateur) ||
        orientation === '' || orientation_optimum === ''
    ) {
        alert('Merci de remplir tous les champs correctement.');
        return;
    }

    // Construction de l’objet à envoyer
    let data = {
        mois_installation,
        an_installation,
        nb_panneaux,
        nb_onduleur,
        pente,
        pente_optimum,
        orientation,
        orientation_optimum,
        surface,
        production_pvgis,
        puissance_crete,
        id_Localisation,
        id_Panneau,
        id_Onduleur,
        id_Installateur
    };

    console.log("Données à envoyer :", data); 

    // Envoie la requête AJAX
    ajaxRequest(
        'POST',
        'http://10.10.51.124/back/Installation',
        (response) => {
            console.log('Installation ajoutée :', response);
            alert('Installation ajoutée en base de données avec succès.');
            form.reset(); // réinitialise le formulaire
        },
        data
    );
});
