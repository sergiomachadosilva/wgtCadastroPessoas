/**
 * Monta o modal para incluir um novo registro
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.modals.modalFormCreate = function() {
	let self = this;
	try{
		indexes['dependentes'] = 0; // zera o contador dos indíces da tabela dinâmica de Dependentes
		indexes['enderecos'] = 0; // zera o contador dos indíces da tabela dinâmica de Endereços		
		
		const idModal = 'modalNew';
		const modalNew = FLUIGC.modal({
			title: 'Novo Registro',
			content: Mustache.render($("#tpl_formModalNew").html()),
			id: idModal,
			size: 'full',
			formModal: true,
			actions: [{
				'label': 'Salvar',
				'autoClose': false,
				'classType': 'btn-success'
			},{
				'label': 'Cancelar',
				'autoClose': true,
				'classType': 'btn-primary btnCancelar'
			}]
	
		}, function(err, data) {
			if (!err) {
				self.forms.initFormValidate(`#${idModal} form.modal-content`);
				self.forms.addMasksForm();
				self.forms.addRulesForm();
				self.forms.initComponentsForm();
				
				$(`#${idModal} form.modal-content`).on('submit', function(e) {
					e.preventDefault();
					const formIsValid = $(this).valid();
				    if(formIsValid){
						Swal.fire({
							title: 'Confirmação!',
							text: "Tem certeza que deseja realizar este cadastro?",
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Sim, quero cadastrar!',
							cancelButtonText: 'Cancelar'
						}).then((result) => {
							if (result.isConfirmed) {
 
								const arrayObjectFormData = $(this)
								.find('input, select, textarea')
								.not('tr:hidden input, tr:hidden select, tr:hidden textarea')
								.serializeArray();
								
								const formData = self.forms.convertFormDataToObject(arrayObjectFormData);
								self.executeCreate(formData, modalNew);							
							}
						})
					}else{
		    			toastr.warning('Erro durante a validação do formulário.', 'Atenção!', {
							positionClass: "toast-top-right",
							closeButton: true
						});
					}
	    		})
			}
		});

	} catch(ex){
		console.error(ex)
	}
}.bind(MyWidget);


/**
 * Monta o modal para visualizar um registro específico
 * @param {object} dados Parâmetro obrigatório, objeto com dados do registro principal e das tabelas dinâmicas
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.modals.modalFormView = function(dados) {
	let self = this;
	try{
		const idModal = 'modalView';
		FLUIGC.modal({
			title: 'Visualização do Registro',
			content: Mustache.render($("#tpl_formModalView").html(), dados),
			id: idModal,
			size: 'full',
			actions: [{
				'label': 'Fechar',
				'autoClose': true,
				'classType': 'btn-primary btnCancelar'
			}]
	
		}, function(err, data) {
			if (!err) {
				self.loading.hide();
			}
		});

	} catch(ex){
		console.error(ex)
	}
}.bind(MyWidget);


/**
 * Monta o modal para atualizar um registro específico
 * @param {object} dados Parâmetro obrigatório, objeto com dados do registro principal e das tabelas dinâmicas
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.modals.modalFormUpdate = function(dados) {
	let self = this;
	try{
		indexes['dependentes'] = 0; // zera o contador dos indíces da tabela dinâmica de Dependentes
		indexes['enderecos'] = 0; // zera o contador dos indíces da tabela dinâmica de Endereços
		
		const idModal = 'modalUpdate';
		const modalUpdate = FLUIGC.modal({
			title: 'Atualizar Registro',
			content: Mustache.render($("#tpl_formModalUpdate").html(), dados),
			id: idModal,
			size: 'full',
			formModal: true,
			actions: [{
				'label': 'Atualizar',
				'autoClose': false,
				'classType': 'btn-success'
			},{
				'label': 'Cancelar',
				'autoClose': true,
				'classType': 'btn-primary btnCancelar'
			}]
	
		}, function(err, data) {
			if (!err) {
				self.loading.hide();
				self.forms.initFormValidate(`#${idModal} form.modal-content`);
				self.forms.addMasksForm()
				self.forms.addRulesForm();
				self.forms.addValuesIntoRowTableDep(dados.dependentes);
				self.forms.addValuesIntoRowTable(dados.enderecos);
				self.forms.initComponentsForm();
				
				$(`#${idModal} form.modal-content`).on('submit', function(e) {
					e.preventDefault();
					const formIsValid = $(this).valid();
				    if(formIsValid){
						Swal.fire({
							title: 'Confirmação!',
							text: "Tem certeza que deseja atualizar este cadastro?",
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Sim, quero atualizar!',
							cancelButtonText: 'Cancelar'
						}).then((result) => {
							if (result.isConfirmed) {
								
								const arrayObjectFormData = $(this)
								.find('input, select, textarea')
								.not('tr:hidden input, tr:hidden select, tr:hidden textarea')
								.serializeArray();
								
								const formData = self.forms.convertFormDataToObject(arrayObjectFormData);
								self.executeUpdate(dados.documentId, formData, modalUpdate);							
							}
						})
					}else{
		    			toastr.warning('Erro durante a validação do formulário.', 'Atenção!', {
							positionClass: "toast-top-right",
							closeButton: true
						});
					}
	    		})
			}
		});

	} catch(ex){
		console.error(ex)
	}
}.bind(MyWidget);


/**
 * Monta o modal com DataTable de usuários
 * @return {void}
 * @author Sérgio Machado
 */
MyWidget.modals.modalListUsers = function() {
  	let self = this;
  	return new Promise((resolve, reject) => {
    	try{
			const idModal = 'modalListaUsers';
			const modalDataTableUsers = FLUIGC.modal({
				title: 'Usuários',
				content: '<div id="renderDataTable" class="table-responsive"></div>',
				id: idModal,
				size: 'full',
				actions: [{
					'label': 'Inserir',
					'autoClose': false,
					'classType': 'btn-success',
					'classType': 'btn-success btnInserir'
				},{
					'label': 'Cancelar',
					'autoClose': true,
					'classType': 'btn-primary'
				}]
		
			}, function(err, data) {
				if (!err) {
					setTimeout(() => {
						resolve({
							instancia: modalDataTableUsers,
							idModal
						})
					}, 100)
				}
			});
		}catch(ex){
			reject(ex)
		}
	});
}.bind(MyWidget);