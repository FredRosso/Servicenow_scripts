/**  UI Action - Create Post Mortem
*    Action name = create_post_mortem_custom
*    Show Insert = true
*    Show Update = true
*    Client = true
*    Form button = true
*    onClick = confirmCreatePM();
*    Condition = new TaskVisibilityUtils().canShowPostMortem(current);
*/

// Côté Client - Affichage du message de confirmation
function confirmCreatePM() {
    var message = "Êtes-vous sûr de vouloir créer un Post Mortem à partir de cet enregistrement ?";

    if (confirm(message)) {
        gsftSubmit(null, g_form.getFormElement(), 'create_post_mortem_custom');
    } else {
        return false;
    }
}

// Côté Serveur - S'éxecute si confirmation
if (typeof window == 'undefined') {
    runServerSideCode();
}

function runServerSideCode() {
    try {
        var inputs = {};
        var tableName = current.getTableName();
        var subflowName = 'global.create_post_mortem';

        if (tableName == 'incident') {
            inputs['incident_record'] = current;
        } else if (tableName == 'problem') {
            inputs['problem_record'] = current;
        } else if (tableName == 'change_request') {
            inputs['change_record'] = current;
        } else if (tableName == 'sc_req_item') {
            inputs['ritm_record'] = current;
        }

        var result = sn_fd.FlowAPI.getRunner().subflow(subflowName).inForeground().withInputs(inputs).run();

        var outputs = result.getOutputs();
        var pmCreated = outputs['created_pm'];

        if (pmCreated) {
            gs.addInfoMessage("le Post Mortem " + pmCreated.number + " a été créé");
            action.setRedirectURL(pmCreated);
        } else {
            gs.addErrorMessage("Post Mortem créé mais la redirection a échoué");
            action.setRedirectURL(current);
        }
    } catch (ex) {
        gs.error("Erreur UI Action Post Mortem : " + ex.getMessage());
        action.setRedirectURL(current);
    }
}
