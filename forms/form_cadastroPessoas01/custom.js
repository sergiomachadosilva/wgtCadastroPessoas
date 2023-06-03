$(document).ready(function() {
	// Insere o contador de linhas nas tabelas pai e filho
	tableLineCount();
	
	FLUIGC.switcher.isReadOnly('#atividadeRemunerada', true);
});


/**
 * Insere a numeração correspondente a cada linha da tabela pai e filho de forma
 * automática.
 * 
 * @param {String} tablename Parâmetro obrigatório, tablename da tabela pai e filho.
 *            Quando informado um valor válido para tablename, o script irá
 *            percorre apenas as linhas da própia tabela. Se informar o valor
 *            false para o parâmetro tablename, o script irá percorrer todas as
 *            tabelas. Recomendado apenas para o carregamento do formulário.
 * @return {void}
 * @author Sérgio Machado
 */
function tableLineCount(tablename) {
	try {
		let atributo = "[tablename]";
		if(tablename){
			atributo = `[tablename='${tablename}']`
		} 
		$.each($(atributo), function(index) {
			const tabelaRow = $(this).find('tbody tr').not(':first');
			tabelaRow.each(function(i) {
				tabelaRow.eq(i).find('td.count').html(`<span>${i + 1}</span>`);
			});
		});
	} catch (ex) {
		console.error("function " + arguments.callee.name + " => " + ex)
	}
}