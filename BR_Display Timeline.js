/**  BR - Display Timeline
*    Table = u_post_mortem
*    When = Async
*    Insert = true
*/

(function executeRule(current, previous /*null when async*/ ) {

    var outageSysId = current.u_task_outage.toString();
    var taskSysId = current.u_task.toString();

    if (taskSysId) {

        var grJournal = new GlideRecord('sys_journal_field');
        grJournal.addQuery('element_id', taskSysId);
        grJournal.addQuery('element', 'IN', 'comments,work_notes');
        grJournal.orderBy('sys_created_on');
        grJournal.query();

        while (grJournal.next()) {

            //var type = grJournal.element == 'comments' ? 'Commentaire' : 'Work Note';
            var grTimeline = new GlideRecord('u_timeline_postmortem');
            grTimeline.initialize();
            grTimeline.u_post_mortem = current.sys_id;
            grTimeline.u_timeline_date = grJournal.sys_created_on;
            grTimeline.u_description = grJournal.value;
            grTimeline.insert();
        }
    } else if (outageSysId) {

        var grJournal = new GlideRecord('sys_journal_field');
        grJournal.addQuery('element_id', outageSysId);
        grJournal.addQuery('element', 'u_work_notes_journal');
        grJournal.orderBy('sys_created_on');
        grJournal.query();

        while (grJournal.next()) {

            //var type = grJournal.element == 'comments' ? 'Commentaire' : 'Work Note';
            var grTimeline = new GlideRecord('u_timeline_postmortem');
            grTimeline.initialize();
            grTimeline.u_post_mortem = current.sys_id;
            grTimeline.u_timeline_date = grJournal.sys_created_on;
            grTimeline.u_description = grJournal.value;
            grTimeline.insert();
        }
    }
})(current, previous);
