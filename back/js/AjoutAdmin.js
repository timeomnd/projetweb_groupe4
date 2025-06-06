// Dès que la page est chargée
window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // empêche le rechargement de la page

        // Récupération des champs
        const mois = parseInt(document.getElementById('mois').value);
        const annee = parseInt(document.getElementById('annee').value);
        const panneaux = parseInt(document.getElementById('panneaux').value);
        const onduleurs = parseInt(document.getElementById('onduleurs').value);
        const pente = parseFloat(document.getElementById('pente').value);
        const pente_optimum = parseFloat(document.getElementById('pente_optimum').value);
        const orientation = parseInt(document.getElementById('orientation').value);
        const orientation_opt = parseInt(document.getElementById('orientation_opt').value);
        const surface = parseFloat(document.getElementById('surface').value);
        const production = parseFloat(document.getElementById('production').value);
        const puissance = parseFloat(document.getElementById('puissance').value);

        // Vérifie que tous les champs sont remplis et valides
        if (
            isNaN(mois) || isNaN(annee) || isNaN(panneaux) || isNaN(onduleurs) ||
            isNaN(pente) || isNaN(pente_optimum) || isNaN(orientation) || isNaN(orientation_opt) ||
            isNaN(surface) || isNaN(production) || isNaN(puissance)
        ) {
            alert('Merci de remplir tous les champs correctement.');
            return;
        }

        // Construction de l’objet à envoyer
        const data = {
            mois,
            annee,
            panneaux,
            onduleurs,
            pente,
            pente_optimum,
            orientation,
            orientation_opt,
            surface,
            production,
            puissance
        };

        console.log("Données à envoyer :", data); 

        // // Envoie la requête AJAX
        // ajaxRequest(
        //     'POST',
        //     'http://10.10.51.124/back/Installation',
        //     (response) => {
        //         console.log('Installation ajoutée :', response);
        //         alert('Installation ajoutée avec succès.');
        //         form.reset(); // réinitialise le formulaire
        //     },
        //     data
        // );
    });
});
