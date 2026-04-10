/**  Fix Script - Restore Archived records
*    Using [sys_archive_log] table with GlideArchiveRestore() API
*    Using BATCH to process restore
*    'archived_table' = where records are archived
*    'base_table' = where records are restored
*/

// On instancie la table des archives
var incArch = new GlideRecord('archived_table');
incArch.addEncodedQuery("sys_archivedBETWEENjavascript:gs.dateGenerate('2025-03-23','00:00:00')@javascript:gs.dateGenerate('2025-05-10','23:59:59')");
incArch.query();

// Variables pour gérer les lots (Batches)
var batchSysIds = [];
var BATCH_SIZE = 500;
var successCount = 0;
var errorCount = 0;

while (incArch.next()) {

    batchSysIds.push(incArch.getUniqueValue());
    // Quand notre tableau atteint 500, on traite le lot
    if (batchSysIds.length === BATCH_SIZE) {
        processBatch(batchSysIds);
        batchSysIds = []; // On vide le tableau pour préparer le lot suivant
    }
}

// Gestion du dernier lot incomplet
if (batchSysIds.length > 0) {
    processBatch(batchSysIds);
}

gs.info("Restauration complète terminée. Succès : " + successCount + " | Échecs : " + errorCount);


/**
 * Fonction locale pour traiter un lot de sys_id
 * @param {Array} sysIds - Tableau contenant jusqu'à 500 sys_id
 */
function processBatch(sysIds) {
    var listArch = new GlideRecord('sys_archive_log');
    listArch.addQuery('from_table', 'base_table');
    listArch.addNullQuery('restored'); 
    listArch.addQuery('id', 'IN', sysIds.join(',')); 
    listArch.query();

    while (listArch.next()) {
      
        var restoreArch = new GlideArchiveRestore().restore(listArch.getUniqueValue());
        
        if (restoreArch) {
            successCount++;
        } else {
            errorCount++;
        }
    }
}
