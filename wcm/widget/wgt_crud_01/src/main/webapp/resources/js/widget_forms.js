/**
 * Adiciona uma nova linha na tabela dinâmica
 * @param {string} tableId Parâmetro obrigatório, Id da tabela dinâmica
 * @param {number} variableIndex Parâmetro obrigatório, variável fora do escopo da função que controla os indíces
 * Cada ttabela dinâmica deverá ter uma variável dessa para realziar esse controle
 * @return {promise} - promise com o indíce da linha adicionada 
 * @author Sérgio Machado
 */
MyWidget.forms.addRowTable = function(tableId, variableIndex) {
	return new Promise(function(resolve) {
	    let index = variableIndex+=1;
	    var table = document.getElementById(tableId);
	    var modelo = table.querySelector('tbody tr:first-child');
	
	    // Clona o modelo e remove o display none
	    var novaLinha = modelo.cloneNode(true);
	    
	    // Pega todos os inputs da nova linha
	    var inputs = novaLinha.querySelectorAll('input, select, textarea');
	
	    // Atualiza o name e o id dos campos
	    inputs.forEach(function (input) {
	        if (input.name) {
	            input.name = `${input.name}___${index}`;
	            if (!input.id) {
	                input.id = input.name;
	            } else {
	                input.id = `${input.id}___${index}`;
	            }
	        }
	    });
	
	    // Insere a nova linha na tabela
	    var tbody = table.querySelector('tbody');
	    tbody.appendChild(novaLinha);
	
	    // Adiciona o efeito slideDown na nova linha
	    $(novaLinha).show(400);
	
	    // Retorna o índice da nova linha
	    resolve(index);
    })
}.bind(MyWidget);


/**
 * Remove uma linha específica da tabela dinâmica
 * @param {HTMLElement} btn Parâmetro obrigatório, botão de exclusão
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.forms.removeRowTable = function(btn) {
	return new Promise(function(resolve) {
	    var row = btn.closest('tr');
	    $(row).hide(400, function () {
	        row.remove();
	        resolve(true);
	    });
    })

}.bind(MyWidget);


/**
 * Inicializa a validação com o jQuery Validation Plugin em um determinado formulário
 * @param {string} target Parâmetro obrigatório, formulário que deseja aplicar a validação
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.initFormValidate = function(target){
	$(target).validate({
		errorClass: 'help-block',
    	errorElement: 'span',
    	highlight: function(element) {
      		$(element).closest('.form-group').addClass('has-error');
    	},
    	unhighlight: function(element) {
      		$(element).closest('.form-group').removeClass('has-error');
    	},
    	errorPlacement: function(error, element) {
      		error.appendTo(element.closest('.form-group'));
    	},
    	success: function(label) {
	      	label.closest('.form-group').addClass('has-success');
	    },

 	});
}.bind(MyWidget);


/**
 * Insere a numeração correspondente a cada linha da tabela dinâmica
 * @param {string} tableId Parâmetro obrigatório, Id da tabela dinâmica
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.countRowsTable = function (tableId) {
    const tabelaRow = $(`#${tableId}`).find('tbody tr').not(':first');
    tabelaRow.each(function (i) {
        tabelaRow.eq(i).find('td.count').html(`<span>${i + 1}</span>`);
    });
}.bind(MyWidget);


/**
  * Converte um array de objetos do formulário 
  * @param {object} formData Parâmetro obrigatório, objeto contendo o nome e o valor de cada campo do formulário
  * @return {object} Retorna um objeto onde cada chave é o nome do campo e seu valor é o valor do campo
  * @author Sérgio Machado
  */	
MyWidget.forms.convertFormDataToObject = function(formData) {
	let result = {};
    for (var i = 0; i < formData.length; i++) {
    	var field = formData[i];
     	result[field.name] = field.value;
   	}
   return result;
}.bind(MyWidget);


/**
 * Adiciona mascáras nos campos do formulário principal
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.addMasksForm = function() {
	//$('#dataNascimento').mask("00/00/0000");
}.bind(MyWidget);


/**
 * Adiciona mascáras nos campos da tabela dinâmica de endereços
 * @param {number} index Parâmetro obrigatório, indíce da tabela dinâmica
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.addMasksFormTableEnd = function(index) {
	$(`#cep___${index}`).mask("99.999-999");
}.bind(MyWidget);


/**
 * Inicializa os componentes do Fluig como 'FLUIGC.calendar' e 'FLUIGC.switcher'
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.initComponentsForm = function() {
	FLUIGC.calendar('#dataNascimento');
	
	FLUIGC.switcher.init('#atividadeRemuneradaOpt');
    FLUIGC.switcher.onChange('#atividadeRemuneradaOpt', function(event, state){
    	if(state){
    		$('#atividadeRemunerada').val('on');
    	}else{
			$('#atividadeRemunerada').val('null');
    	}
    });
    
}.bind(MyWidget);

/**
 * Adiciona regras de validações e mensagens customizadas para o campos do formulário principal
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.addRulesForm = function() {
	
	//Defina uma nova regra de validação personalizada para validar se uma data é válida
	$.validator.addMethod("validDate", function(value, element) {
	    var date = moment(value, "DD/MM/YYYY");
	    return date.isValid();
	}, "Informe uma data válida (dd/mm/yyyy)");

    // Define as regras de validações
    $('#nome').rules('add', {
        required: true,
        minlength: 6,
        messages: {
        	required: 'Campo obrigatório',
        	minlength: 'O Nome deve ser igual ou maior que {0} caracteres'
        }
    });
    
    $('#profissao').rules('add', {
        required: true,
        minlength: 4,
        messages: {
        	required: 'Campo obrigatório',
        	minlength: 'A Profissão deve ser igual ou maior que {0} caracteres'
        }
    });
    
    $('#dataNascimento').rules('add', {
        required: true,
        validDate: true,
        messages: {
        	required: 'Campo obrigatório',
        }
    });
    
}.bind(MyWidget);



/**
 * Adiciona valores nos campos na tabela dinâmica de Endereços
 * @param {object[]} data Parâmetro obrigatório, Lista de dados a serem adicionados
 * @return {void}
 * @author Sérgio Machado
 */
 MyWidget.forms.addValuesIntoRowTable = async function(data) {
	const tableId = 'tableEnderecos'; 
	let indice = 0;
	for(let endereco of data){
		indice = await this.forms.addRowTable(tableId, indice);
		indexes['enderecos'] = indice;
		
		$(`#cep___${indice}`).val(endereco.cep);
        if(endereco.endereco){
			$(`#endereco___${indice}`).val(endereco.endereco);
		}
        if(endereco.bairro){
			$(`#bairro___${indice}`).val(endereco.bairro);
		}
		$(`#numero___${indice}`).val(endereco.numero);
		$(`#cidade___${indice}`).val(endereco.cidade);
		$(`#estado___${indice}`).val(endereco.estado);

		this.forms.addMasksFormTableEnd(indice);
		this.forms.addRulesFormTableEnd(indice);
		this.forms.countRowsTable('tableEnderecos');
	}	
}.bind(MyWidget)


/**
 * Adiciona valores nos campos na tabela dinâmica de Dependentes
 * @param {object[]} data Parâmetro obrigatório, Lista de dados a serem adicionados
 * @return {void}
 * @author Sérgio Machado
 */
 MyWidget.forms.addValuesIntoRowTableDep = async function(data) {
	const tableId = 'tableDependentes'; 
	let indice = 0;
	for(let dependente of data){
		indice = await this.forms.addRowTable(tableId, indice);
		indexes['dependentes'] = indice;
		
		$(`#dependenteNome___${indice}`).val(dependente.nome);
		$(`#dependenteMatricula___${indice}`).val(dependente.matricula);
		$(`#dependenteLogin___${indice}`).val(dependente.login);
		$(`#dependenteEmail___${indice}`).val(dependente.email);

		this.forms.addRulesFormTableDep(indice);
		this.forms.countRowsTable('tableDependentes');
	}	
}.bind(MyWidget)


/**
 * Adiciona regras de validações e mensagens customizadas para o campos da tabela dinâmica de Endereços
 * @param {number} index Parâmetro obrigatório, indíce da tabela dinâmica
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.addRulesFormTableEnd = function(index) {
	let self = this;
	//Defina uma nova regra de validação personalizada para validar se o CEP é válido
	$.validator.addMethod("validCep", function(value, element) {
    	return this.optional(element) || /^\d{2}\.\d{3}\-\d{3}$/.test(value);
  	}, "Informe um CEP válido (99.999-999)");
	
    // Define as regras de validações
    $(`#cep___${index}`).rules('add', {
        required: true,
        validCep: true,
        messages: {
            required: 'Campo obrigatório',
        }
    });
    
	$(`#cidade___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório',
        }
    });
    
    $(`#estado___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório',
        }
    });
    
    
     // Adiciona um evento para capturar a mudança de valor do campo de CEP
    $(`#cep___${index}`).on('input', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep.length === 8) {
			self.loading.show();
			
			// Executa função para buscar dados do CEP
            self.services.getAdressByCep(cep).then((endereco) => {
            	if(endereco.logradouro){
					$(`#endereco___${index}`).val(endereco.logradouro).prop('readonly', true);
				}else{
					$(`#endereco___${index}`).val('').prop('readonly', false);
				}
                if(endereco.bairro){
					$(`#bairro___${index}`).val(endereco.bairro).prop('readonly', true);
				}else{
					$(`#bairro___${index}`).val('').prop('readonly', false);
				}
                $(`#cidade___${index}`).val(endereco.localidade);
                $(`#estado___${index}`).val(endereco.uf);
             	
             	toastr.success(`CEP <b>${$(this).val()}</b> adicionado`, 'Sucesso!', {
					"positionClass": "toast-top-right",
					"closeButton": true,
				});
            }).catch((ex) => {
            	self.utils.handleError('Erro ao obter dados do CEP', ex)
            }).finally(() =>{
				self.loading.hide();
			});
        }else{
			$(`#endereco___${index}`).val('').prop('readonly', true);
			$(`#numero___${index}`).val('');
			$(`#bairro___${index}`).val('').prop('readonly', true);
			$(`#cidade___${index}`).val('').prop('readonly', true);
			$(`#estado___${index}`).val('').prop('readonly', true);
		}
    });
    
}.bind(MyWidget);


/**
 * Adiciona regras de validações e mensagens customizadas para o campos da tabela dinâmica de Dependentes
 * @param {number} index Parâmetro obrigatório, indíce da tabela dinâmica
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.forms.addRulesFormTableDep = function(index) {
    
    $(`#dependenteNome___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório'
        }
    });
    
    $(`#dependenteMatricula___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório'
        }
    });
    
    $(`#dependenteLogin___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório'
        }
    });
    
    $(`#dependenteEmail___${index}`).rules('add', {
        required: true,
        messages: {
            required: 'Campo obrigatório'
        }
    });
     
}.bind(MyWidget);


/**
 * Seta valores dos campos de uma linha da tabela dinâmica de Dependentes
 * @param {number | string} indice Parâmetro obrigatório, Indíce da linha da tabela dinâmica
 * @param {object} user Parâmetro obrigatório, Objeto com os dados do dependente
 * @return {void}
 * @author Sérgio Machado
 */
 MyWidget.forms.setValuesUser = function(indice, user) {
	
	$(`#dependenteNome___${indice}`).val(user.nome ? user.nome : '');
	$(`#dependenteMatricula___${indice}`).val(user.matricula ? user.matricula : '');
	$(`#dependenteLogin___${indice}`).val(user.login ? user.login : '');
	$(`#dependenteEmail___${indice}`).val(user.email ? user.email : '');
	
}.bind(MyWidget)


/**
 * Valida para que não seja possível selecionar um mesmo dependente mais de uma vez
 * @param {string} matricula Parâmetro obrigatório, Matrícula do usuário
 * @returns {Promise} 
 * @author Sérgio Machado
 */
 MyWidget.forms.userIsDuplicate = function(matricula) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			const tableRows = $('#tableDependentes').find('tbody tr').not(':first');
			for(let i =0; i < tableRows.length; i++){
				let indice = self.forms.getIndiceTable(tableRows.eq(i).find("input")[0].id);
				let dependenteMatricula = tableRows.eq(i).find(`#dependenteMatricula___${indice}`).val();
				if(matricula == dependenteMatricula){
					reject(`A matrícula ${matricula} está duplicada`)
					break;
				}
			}
			resolve()
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Retorna o índice da linha da tabela dinãmica com base em uma string que pode ser o name ou id de um campo qualquer 
 * @param {String} id Parâmetro obrigatório, id ou name de um campo qualquer da tabela pai e filho
 * @return {String}
 * @author Sérgio Machado
 */
MyWidget.forms.getIndiceTable = function(id) {
	return id.split('___').pop();
}.bind(MyWidget);


