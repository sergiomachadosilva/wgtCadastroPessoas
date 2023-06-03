/**
  * Exibe modal com mensagem do erro na tela
  * @param {string} title Parâmetro obrigatório, título da mensagem do erro
  * @param {string} ex Parâmetro obrigatório, exception lançada pela função
  * @return {string}
  * @author Sérgio Machado
  */	
MyWidget.utils.handleError = function(title, ex) {
	var messageError = this.utils.handleErrorValidateForm(ex);
	console.error(messageError)
	this.loading.hide();
	Swal.fire(
		'Erro!',
	    `${title}: <br /><b style='color:#fa5353;'>${messageError}</b>`,
	    'error'
	);
}.bind(MyWidget);


/**
  * Trata a mensagem de erro removendo a parte '(validateForm#xx)' 
  * @param {string} str Parâmetro obrigatório, mensagem de erro
  * @return {string}
  * @author Sérgio Machado
  */	
MyWidget.utils.handleErrorValidateForm = function(str) {
  var regex = /(\(validateForm#\d+\))|(JavaException: com\.fluig\.ecm\.exception\.validation\.ECMCardIndexUpdateException:)/g;
  // expressão regular que captura a parte (validateForm#xx) ou a string "JavaException: com.fluig.ecm.exception.validation.ECMCardIndexUpdateException:"
  return str.replace(regex, ''); 
}.bind(MyWidget);


/**
 * Método para facilitar a criação de objetos que representam uma constraint
 * @param {string} field Parâmetro obrigatório, nome do campo que será filtrado
 * @param {string | number | boolean | null} initialValue Parâmetro obrigatório, valor inicial do campo a ser filtrado
 * @param {string | number | boolean | null} finalValue Parâmetro opcional, valor final do campo a ser filtrado
 * @param {?number} type Parâmetro opcional, tipo da condição que podem ser (1 - MUST, 2 - SHOULD, 3 - MUST_NOT)
 * @param {?boolean} likeSearch Parâmetro opcional
 * @return {object}
 * @author Sérgio Machado
 */
MyWidget.utils.createConstraint = function(field, initialValue, finalValue = initialValue, type = 1, likeSearch = false) {
	if (typeof field !== "string" || typeof initialValue === "undefined") {
		throw new TypeError("Os parâmetros field e initialValue são obrigatórios e initialValue não pode ser undefined");
	}
  	if (![1, 2, 3].includes(type)) {
  		throw new TypeError("O parâmetro type deve ser um número válido (1, 2 ou 3)");
	}
	if (typeof likeSearch !== "boolean") {
		throw new TypeError("O parâmetro likeSearch deve ser um valor booleano");
	}

	return {
		_field: field,
		_initialValue: initialValue,
		_finalValue: finalValue,
		_type: type,
		_likeSearch: likeSearch
	};
		  
}.bind(MyWidget);