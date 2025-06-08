// Dès que la page est chargée
window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // empêche le rechargement de la page

        // Récupération des champs 
        //Champs numériques 
        let mois = parseInt(document.getElementById('mois').value);
        let annee = parseInt(document.getElementById('annee').value);
        let panneaux = parseInt(document.getElementById('panneaux').value);
        let onduleurs = parseInt(document.getElementById('onduleurs').value);
        let pente = parseFloat(document.getElementById('pente').value);
        let pente_optimum = parseFloat(document.getElementById('pente_optimum').value);
        let surface = parseFloat(document.getElementById('surface').value);
        let production = parseFloat(document.getElementById('production').value);
        let puissance = parseFloat(document.getElementById('puissance').value);
        let id_localisation = parseInt(document.getElementById('id_localisation').value);
        let id_panneau = parseInt(document.getElementById('id_panneau').value);
        let id_onduleur = parseInt(document.getElementById('id_onduleur').value);
        let id_installateur = parseInt(document.getElementById('id_installateur').value);

        //Champs pouvante etre texuels
        let orientation = document.getElementById('orientation').value.trim();
        let orientation_optimum = document.getElementById('orientation_opt').value.trim();

        // Vérifie que tous les champs sont remplis et valides
        if (
            isNaN(mois) || isNaN(annee) || isNaN(panneaux) || isNaN(onduleurs) ||
            isNaN(pente) || isNaN(pente_optimum) || isNaN(surface) || isNaN(production) || isNaN(puissance) ||
            isNaN(id_localisation) || isNaN(id_panneau) || isNaN(id_onduleur) || isNaN(id_installateur) 
            || orientation === '' || orientation_optimum === ''
        ) {
            alert('Merci de remplir tous les champs correctement.');
            return;
        }

        // Construction de l’objet à envoyer
        let data = {
            mois,
            annee,
            panneaux,
            onduleurs,
            pente,
            pente_optimum,
            orientation,
            orientation_optimum,
            surface,
            production,
            puissance,
            id_localisation,
            id_panneau,
            id_onduleur,
            id_installateur
        };

        console.log("Données à envoyer :", data); 

        // // Envoie la requête AJAX
        // ajaxRequest(
        //     'POST',
        //     'http://10.10.51.124/back/Installation',
        //     (response) => {
        //         console.log('Installation ajoutée :', response);
        //         alert('Installation ajoutée en base de données avec succès.');
        //         form.reset(); // réinitialise le formulaire
        //     },
        //     data
        // );
    });
});
