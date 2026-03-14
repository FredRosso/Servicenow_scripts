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
        pmExist.addQuery('u_task', current.getUniqueValue());
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

        // Tables gérées
        var config = {
            'u_timeline_postmortem': true,
            'u_cause_postmortem': true,
            'u_capitalisation_postmortem': true
        };

        var tableName = current.getTableName();

        if (!config[tableName]) return;

        // Récupération du lien parent
        var pmID = current.getValue('u_post_mortem');
        if (!pmID) return;

        // Accès si "Créateur" ou dans "Watch_list"
        var pmGr = new GlideRecord('u_post_mortem');
        if (pmGr.get(pmID)) {
            var userID = gs.getUserID();
            var isCreator = (pmGr.getValue('u_creator') == userID);
            var isInWatchList = (pmGr.getValue('watch_list') && pmGr.getValue('watch_list').indexOf(userID) > -1);

            if (!isCreator && !isInWatchList) {
                gs.addErrorMessage("Accès restreint au créateur et à la watch list du Post Mortem.");
                current.setAbortAction(true);
            }
        }

    },

    type: 'TaskVisibilityUtils'
};
