'use strict';


document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('admin-password');
    const btn = document.getElementById('admin-password-btn');

    function checkPassword() {
        let mdp = input.value;
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