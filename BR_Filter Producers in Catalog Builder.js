/**  BR - Filter Producers in Catalog Builder
*    Table = sc_cat_item
*    When = Before
*    Query = true
*    Description = Exclure les Record Producers & les Order Guides de l'interface Catalog Builder.
*    Condition = !gs.hasRole('admin')
*/

(function executeRule(current, previous /*null when async*/ ) {

    var stack = GlideTransaction.get().getRequest().getHeader("referer");
    var isBuilder = (stack && stack.indexOf("now/build/catalog") > -1);
    
    if (isBuilder) {
        current.addQuery('sys_class_name', '!=', 'sc_cat_item_producer');
		    current.addQuery('sys_class_name', '!=', 'sc_cat_item_guide');
    }

})(current, previous);
