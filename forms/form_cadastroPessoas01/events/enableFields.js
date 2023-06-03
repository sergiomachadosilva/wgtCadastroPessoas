function enableFields(form){
	disableAllFields(form);
	
	form.setEnabled("atividadeRemunerada", true);
}

function disableAllFields(form) {
	var fields = form.getCardData();
	var keys = fields.keySet().toArray();
	for (var k in keys) {
		var field = keys[k];
		form.setEnabled(field, false);
	}
}