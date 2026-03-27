function onLoad() {
    // On lance une vérification toutes les 60 secondes
    setInterval(function() {
      
        // Si au moins un champ a été modifié par l'utilisateur
        if (g_form.modified) {
          
            // On déclenche la sauvegarde native ServiceNow
            g_form.save();
        }
    }, 60000);
}
