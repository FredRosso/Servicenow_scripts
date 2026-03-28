/**  BR - HTML Interpretation
*    When = Before
*    Insert = true | Update = true
*/

(function executeRule(current, previous /*null when async*/) {

    // 1. On récupère la valeur brute avec les balises
    var rawHTML = current.getValue('u_html_field'); // Remplace par le nom de ton champ HTML

    if (!gs.nil(rawHTML)) {
        // 2. On utilise une Regex pour retirer toutes les balises HTML (<p>, <b>, <div>, etc.)
        var cleanText = rawHTML.replace(/<[^>]*>?/gm, '');
        
        // 3. On nettoie les entités HTML courantes (comme le &#39; pour les apostrophes ou &nbsp; pour les espaces)
        cleanText = cleanText.replace(/&#39;/g, "'")
                             .replace(/&quot;/g, '"')
                             .replace(/&amp;/g, '&')
                             .replace(/&lt;/g, '<')
                             .replace(/&gt;/g, '>')
                             .replace(/&nbsp;/g, ' ');

        // 4. On pousse le texte propre dans notre Shadow Field
        current.setValue('u_description_text', cleanText);
    } else {
        current.setValue('u_description_text', '');
    }

})(current, previous);
