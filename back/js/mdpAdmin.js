'use strict';

// Ce script affiche une modale demandant le mot de passe admin à l'arrivée sur la page admin.
// Si l'utilisateur a déjà validé le mot de passe dans cette session, la modale ne s'affiche plus.

document.addEventListener('DOMContentLoaded', function() {

    
    // Vérifie si l'utilisateur est déjà authentifié dans cette session
    if (sessionStorage.getItem('admin_auth') === 'ok') {
        document.getElementById('password-modal').style.display = "none";
        return;
    }

    const modal = document.getElementById('password-modal');
    const input = document.getElementById('admin-password');
    const btn = document.getElementById('admin-password-btn');

    function checkPassword() {
        let mdp = input.value;
        //On utilise fetch pour envoyer le mot de passe au serveur, car c'est une méthode native JS et la vérification du mdp admin est un cas simple.
        //Cela suffit pour ce besoin ponctuel.
        fetch('../../../back/config/checkPasswordAdmin.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: mdp})
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert("Mot de passe incorrect. Retour à l'accueil utilisateur.");
                window.location.href = "../User/accueil.html";
            } else {
                sessionStorage.setItem('admin_auth', 'ok');
                modal.style.display = "none";
            }
        })
        .catch(() => {
            alert("Erreur serveur.");
            window.location.href = "../User/accueil.html";
        });
    }

    btn.addEventListener('click', checkPassword);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') checkPassword();
    });
});