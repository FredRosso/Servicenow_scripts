/**  Script Include - TaskVisibilityUtils
*    Scope : Global */

var TaskVisibilityUtils = Class.create();
TaskVisibilityUtils.prototype = {
    initialize: function() {},

    /**
     * Vérifie si le bouton "Créer un Post Mortem" doit s'afficher
     * @param {GlideRecord} current - Enregistrement actuel (Task ou Outage)
     * @return {Boolean}
     */

    canShowPostMortem: function(current) {

        var pmExist = new GlideRecord('u_post_mortem');
        var pMortem = pmExist.addQuery('u_task', current.getUniqueValue());
        pMortem.addOrCondition('u_task_outage', current.getUniqueValue());
        pmExist.setLimit(1);
        pmExist.query();
        if (pmExist.hasNext()) {
            return false;
        }

        var tableName = current.getTableName();
        var state = current.getValue('state');

        switch (tableName) {
            case 'incident':
                return state == '6' || state == '7';
            case 'problem':
                return state == '30' || state == '4';
            case 'change_request':
                return state == '0' || state == '3';
            case 'sc_req_item':
                return state == '3';
            case 'cmdb_ci_outage':
                return !current.end.nil();
            default:
                return false;
        }
    },

    /**
     * Valide l'accès pour les tables de composants Post Mortem
     * @param {GlideRecord} current - Le record de la Timeline, Cause ou Capitalisation
     */

    canCreateEmbeddedRecord: function(current) {

        // Tables gérées (Embedded List)
        var config = {
            'u_timeline_postmortem': true,
            'u_cause_postmortem': true,
            'u_capitalisation_postmortem': true
        };

        var tableName = current.getTableName();

        if (!config[tableName]) return;

        // Récupération du lien parent
        var pmID = current.getValue('u_post_mortem');
        if (gs.nil(pmID)) return;

        // Récupérer le Créateur et la liste des groupes directement depuis le parent
        var isCreator = (current.u_post_mortem.u_creator == gs.getUserID());
        var participantGroups = current.u_post_mortem.u_participant.toString();
        var isParticipant = false;

        if (!gs.nil(participantGroups)) {
            var groupArray = participantGroups.split(',');

            for (var i = 0; i < groupArray.length; i++) {
                if (gs.getUser().isMemberOf(groupArray[i])) {
                    isParticipant = true;
                    break;
                }
            }
        }
        // Blocage si les conditions ne sont pas remplies
        if (!isCreator && !isParticipant) {
            gs.addErrorMessage("Accès restreint au créateur du Post Mortem et aux membres des groupes participants.");
            current.setAbortAction(true);
        }
    },

    type: 'TaskVisibilityUtils'
};
