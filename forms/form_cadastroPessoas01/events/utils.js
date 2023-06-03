/**
 * Realiza validação da tabela para e filho de Endereços
 * @param {object} form Parâmetro obrigatório, objeto formController
 * @return {throw}
 * @author Sérgio Machado
 */
function validarEnderecos(form) {
	var indexes = form.getChildrenIndexes("enderecos");
	if (indexes.length > 0) {
		for (var i = 0; i < indexes.length; i++) {
			var row = indexes[i];
			var cep = String(form.getValue("cep___" + row));
			var endereco = String(form.getValue("endereco___" + row));
			var numero = String(form.getValue("numero___" + row));
			var cidade = String(form.getValue("cidade___" + row));
			var estado = String(form.getValue("estado___" + row));
			
			if(!cep){
				throw "CEP não informado na linha " + (i + 1);
			} else if(!validarCep(cep)){
				throw "CEP "+cep+" inválido na linha " + (i + 1);
			}
			if(!endereco){
				throw "Endereço não informado na linha " + (i + 1);
			}
			
			if(!numero){
				throw "Número não informado na linha " + (i + 1);
			}
			
			if(!cidade){
				throw "Cidade não informada na linha " + (i + 1);
			}
			
			if(!estado){
				throw "Estado não informado na linha " + (i + 1);
			}
		}
	}else{
		throw "Por favor, adicione pelo menos 01 Endereço na lista";
	}
}


/**
 * Valida se o cep esta no formato 00000-000
 * @param {String} cep Parâmetro obrigatório, cep que deseja validar
 * @return {boolean} Retorna verdadeiro caso o cep seja válido, caso contrário retorna false
 * @author Sérgio Machado
 */
function validarCep(cep) {
	var expressao = new RegExp(/^\d{2}\.\d{3}-\d{3}$/);
	if (cep == '' || !expressao.test(cep)) {
		return false;
	} 
	return true
}