/**  BR - Display Applications & Outages
*    Table = u_post_mortem
*    When = Before
*    Insert = true
*/

(function executeRule(current, previous /*null when async*/ ) {

    var grTask = current.u_task;
    var grOutage = current.u_task_outage;
    var result = [];

    if (grTask) {
        var grLink = new GlideRecord('task_outage');
        grLink.addQuery('task', grTask);
        grLink.query();
        while (grLink.next()) {

            var grLinkOutage = new GlideRecord('cmdb_ci_outage');
            if (grLinkOutage.get(grLinkOutage.outage)) {

                // Récupération du type "u_type"
                var outageType = grLinkOutage.getDisplayValue('u_type');

                //CI - eOUTAGE - Type
                var line = grLinkOutage.cmdb_ci.getDisplayValue() + "  |  " + grLinkOutage.number + "  |  " + outageType;

                result.push(line);
            }
        }
    } else if (grOutage) {
        var linkOutage = new GlideRecord('cmdb_ci_outage');
        linkOutage.addEncodedQuery('u_parent=' + grOutage);
        linkOutage.query();
        while (linkOutage.next()) {
			
            var outageType = linkOutage.getDisplayValue('u_type');
            var line = linkOutage.cmdb_ci.getDisplayValue() + "  |  " + linkOutage.number + "  |  " + outageType;

            result.push(line);
        }
    }

    // Injection des Outages dans le champ "List of affected applications"
    if (result.length > 0) {
        current.u_affected_application = result.join('\n');
    } else {
        current.u_affected_application = '';
    }

})(current, previous);
