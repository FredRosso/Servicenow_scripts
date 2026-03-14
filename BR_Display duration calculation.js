/**  BR - Display duration calculation
*    When : onBefore
*    Insert & Update */

(function executeRule(current, previous /*null when async*/) {

	  // Vérifie que les dates sont présentes
    if (!current.u_start_date || !current.u_resolution_date) {
        current.u_duree = null;
        return;
    }
    // Conversion en GlideDateTime
    var start = new GlideDateTime(current.u_start_date);
    var end   = new GlideDateTime(current.u_resolution_date);

    var diffMillis = end.getNumericValue() - start.getNumericValue();
    if (diffMillis < 0) diffMillis = 0;

    // Création d'un GlideDuration etant donné que le type du champ est duration / class name ***GlideDuration
    var duration = new GlideDuration();
    duration.setValue(diffMillis); // en millisecondes

	  // injection dans le champ duration
    current.u_duration = duration;
  
})(current, previous);
