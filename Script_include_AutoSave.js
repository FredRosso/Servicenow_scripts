var AutoSave = Class.create();
AutoSave.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	save: function() {
		var fieldName = this.getParameter('sysparm_fieldname');
		var fieldValue = this.getParameter('sysparm_fieldvalue');
		var sysId = this.getParameter('sysparm_sysid');
		var tableName = this.getParameter('sysparm_tablename');
		var recordGr = new GlideRecord(tableName);
		if (!recordGr.get(sysId)) {
			return false;
		}
		recordGr[fieldName] = fieldValue;
		var success = recordGr.update();
		return success;
	},

    type: 'AutoSave'
});
