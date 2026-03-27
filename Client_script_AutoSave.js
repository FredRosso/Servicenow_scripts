function onLoad() {
	
    function save(fieldExtendedName, originalValue, newValue) {
      
		    var tableName = fieldExtendedName.split('.')[0];
		    var fieldName = fieldExtendedName.split('.')[1];
      
        var saveGa = new GlideAjax('AutoSave');
        saveGa.addParam('sysparm_name', 'save');
        saveGa.addParam('sysparm_fieldname', fieldName);
        saveGa.addParam('sysparm_fieldvalue', newValue);
        saveGa.addParam('sysparm_sysid', g_form.getUniqueValue());
        saveGa.addParam('sysparm_tablename', tableName);
    }
  
	g_form.onUserChangeValue(save);
}
