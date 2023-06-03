function validateForm(form){
	form.setHidePrintLink(true);
	try {
		var nome = String(form.getValue("nome"));
		var profissao = String(form.getValue("profissao"));
				
		if (!nome) {
			throw "Informe o Nome";
		}
		
		if (!profissao) {
			throw "Informe a Profissão";
		}
		
		// Validar tabela dinâmica de endereços
		validarEnderecos(form)
		
	}catch(ex) {
		throw ex
	}
}