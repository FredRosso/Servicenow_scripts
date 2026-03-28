/**  BR - Display number of related objects
*    Table = u_post_mortem
*    When = Before
*    Insert = true
*/

(function executeRule(current, previous /*null when async*/ ) {

    var relatedTask = current.u_task;
    var relatedOutage = current.u_task_outage;

    if (!relatedTask && !relatedOutage) {
        current.u_incident_number = 0;
        return;
    }

    if (relatedTask && !relatedOutage) {

        //On compte le nombre d'enregistrements dans la table [u_im_m2m_incident_task] liés à l'Incident du Post Mortem.
        var gaTask = new GlideAggregate('u_im_m2m_incident_task');
        gaTask.addQuery('u_incident', relatedTask);
        gaTask.addAggregate('COUNT');
        gaTask.query();

        var count = 0;

        if (gaTask.next()) {
            count = parseInt(gaTask.getAggregate('COUNT'), 10);
        }


    } else if (relatedOutage && !relatedTask) {
        //On compte le nombre d'enregistrements dans la table [task_outage] liés à l'outage du Post Mortem.
        var gaOutage = new GlideAggregate('task_outage');
        gaOutage.addQuery('outage', relatedOutage);
        gaOutage.addAggregate('COUNT');
        gaOutage.query();

        var count = 0;

        if (gaOutage.next()) {
            count = parseInt(gaOutage.getAggregate('COUNT'), 10);
        }
    }

    // Injection dans le champ "Incident number" du Post Mortem
    current.u_incident_number = count;

})(current, previous);
