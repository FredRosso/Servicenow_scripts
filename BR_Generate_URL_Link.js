/**  BR - Generate URL Link

(function executeRule(current, previous /*null when async*/) {

    var refValue = current.getValue('u_reference');
	  var refTool = current.getValue('u_tracking_tool');
    if (!refValue) return;

    var instanceName = gs.getProperty('instance_name');
	  var instanceGojira = gs.getProperty('gojira.instance.url');
    var baseUrl = "https://" + instanceName + ".service-now.com/now/nav/ui/classic/params/target/";
    var finalUrl = "";

    // Mapping des préfixes vers le nom des tables
    var mapping = {
        "eINC": "incident",
        "ePRB": "problem",
        "eCHG": "change_request",
        "eRITM": "sc_req_item",
        "eOUT": "cmdb_ci_outage"
    };

    if (refTool.indexOf("2") === 0) {
        // Cas GoJira (pas d'encodage)
        finalUrl = instanceGojira + refValue;
    } else {
        // Cas ServiceNow (SPICE)
        for (var prefix in mapping) {
            if (refValue.indexOf(prefix) === 0) {
                var tableName = mapping[prefix];
                // Construction de l'URL
                var targetPage = tableName + ".do?sysparm_query=number=" + refValue;
                
                // Encodage de l'URL
                finalUrl = baseUrl + encodeURIComponent(targetPage);
                break;
            }
        }
    }

    if (finalUrl !== "") {
        current.u_link = finalUrl;
    }

})(current, previous);
