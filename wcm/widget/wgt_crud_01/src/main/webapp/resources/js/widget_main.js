/*
 * O objeto 'indexes' controla os indíces das tabelas dinâmicas
 * Foi necessários colocar ele fora do escopo da SuperWidget para geração correta dos indíces
 * É necessários que para cada tabela dinâmica você crie uma nova propriedade dentro do objeto 'indexes'
 * e realize a implementação seguindo o exemplo desse projeto.
 * A mesma propriedade pode ser utilizada tanto para o modal de criação como para o modal de atualização de registro
 */
let indexes = {
	enderecos: 0,
	dependentes: 0
}

var MyWidget = SuperWidget.extend({
    
	//variáveis da widget
    loading: FLUIGC.loading(window, {
	    delay: 100,
	    timeout: 0,
	    overlayCSS:  { 
        	backgroundColor: 'rgba(0, 0, 0, 0.30)', 
        	opacity: 1, 
        	cursor: 'wait'
    	}, 
	}),
    utils: {}, 
    dataTables: {},
    forms: {},
    modals: {},
    pdfMake: {},
    services: {},
    datasetCrud: 'crud_cadastroPessoas01',
    currentUser: null, // Objeto com informações do usuário logado 
    listUsers: null, // Lista de usuário do Fluig
    
    //Método iniciado quando a widget é carregada
    init: async function() {
		this.loading.show();
		$('#visualizacaoPagina').css('display', 'none');
     	
     	this.initSync().then(()=>{
			$('#visualizacaoPagina').css('display', '');
		}).catch((ex) => {
			this.utils.handleError('Erro ao carregar dados da página', ex);
		}).finally(() => {
			this.loading.hide();
		});
    },
    
  
    //BIND de eventos
    bindings: {
        local: {
			'buscar': ['click_buscarDados'], // Busca dados em um período de datas
			'view': ['click_openModalFormView'], // Abre modal de criação
			'update': ['click_openModalFormUpdate'], // Abre modal de atualização
			'destroy': ['click_executeDestroy'], // Deleta um registro específico
			'maximizar': ['click_executeMaximizarPanel'], // Maximizar um panel
	    },
        global: {
			'addRowDep': ['click_executeAddRowDep'], // Adiciona nova linha de Dependente
			'removeRowDep': ['click_executeRemoveRowDep'], // Remove um Dependentes específico
			'setEmptyRowDep': ['click_executeSetEmptyRowDep'], // Limpa os campos de uma linha de Dependentes
			'addRowEnd': ['click_executeAddRowEnd'], // Adiciona nova linha de Endereço
			'removeRowEnd': ['click_executeRemoveRowEnd'], // Remove um Endereço específico
			'openModalUsers': ['click_executeOpenModalUsers'], // Exibe modal com a lista de usuários
		}
    },
    
    /**
     * Maximizar Panel
     * @return {void}
     * @author Sérgio Machado
     */
    executeMaximizarPanel: async function(htmlElement, event) {
    	try{
			const btn = event.currentTarget
			const icon = btn.querySelector('.flaticon');
			icon.classList.toggle('flaticon-maximize')
        	icon.classList.toggle('flaticon-minimize')
        	btn.title = btn.title === 'Maximizar' ? 'Minimizar' : 'Maximizar';
        	btn.closest('.panel').classList.toggle('panel-fullscreen')
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	}  
    },
    
    
    /**
     * Adiciona uma nova linha na tabela dinâmica de Dependente
     * @return {void}
     * @author Sérgio Machado
     */
    buscarDados: async function(htmlElement, event) {
    	try{
	
			this.loading.show();
			await this.executeGetAll();
			
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	} finally{
			this.loading.hide();
		} 
    },
       
    /**
     * Adiciona uma nova linha na tabela dinâmica de Dependente
     * @return {void}
     * @author Sérgio Machado
     */
    executeAddRowDep: function(htmlElement, event) {
    	try{
			const tableId = 'tableDependentes'; 
			this.forms.addRowTable(tableId, indexes['dependentes']).then((indice) =>{
				indexes['dependentes'] = indice;
				
				this.forms.addRulesFormTableDep(indice);
				this.forms.countRowsTable(tableId);
				
				// Encontra a última linha da tabela e desliza atéo final do modal
				const tabela = document.querySelector(`#${tableId}`);
  				const ultimaLinha = tabela.rows[tabela.rows.length - 1];
				ultimaLinha.scrollIntoView({ behavior: 'smooth' });
			})
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	} 
    },
    
    
    /**
     * Remove uma linha específica da tabela dinâmica de Dependente
     * @return {void}
     * @author Sérgio Machado
     */
    executeRemoveRowDep: function(htmlElement, event) {
    	try{
			const tabelaId = $(htmlElement).closest('table')[0].id;
			Swal.fire({
				title: 'Tem certeza?',
				text: "Você ainda será capaz de reverter isso, apenas atualizando a página!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sim, quero remover!',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.isConfirmed) {
					
					this.forms.removeRowTable(htmlElement).then(() =>{
						toastr.warning('Dependente removido da lista', 'Atenção!', {
							positionClass: "toast-top-right",
							closeButton: true
						});

						this.forms.countRowsTable(tabelaId);
		
					});
				}
			})
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	} 
    },
    
    /**
     * Exibe modal com a lista de usuários para selecionar na tabela dinâmica de Dependentes
     * @return {void}
     * @author Sérgio Machado
     */
    executeOpenModalUsers: async function(htmlElement, event) {
    	try{
			this.loading.show();
			const inputGroup = $(htmlElement).closest('.input-group-custom');
			const indice = this.forms.getIndiceTable(inputGroup.find('input')[0].id);
					
			const users = await this.services.getUsersFluig();
			const modal = await this.modals.modalListUsers();
			this.dataTables.usersFluig(indice, users, modal);
					
	   	} catch(ex){
			this.utils.handleError('Erro ao renderizar a lista de usuários', ex);
    	} finally{
			this.loading.hide();
		} 
    },
    
    
    /**
     * Limpa os campo de uma linha específica da tabela dinâmica de Dependente
     * @return {void}
     * @author Sérgio Machado
     */
    executeSetEmptyRowDep: function(htmlElement, event) {
    	try{
			const inputGroup = $(htmlElement).closest('.input-group-custom');
			const indice = this.forms.getIndiceTable(inputGroup.find('input')[0].id);
			const nome = $(`#dependenteNome___${indice}`).val();
			
			if(nome){
				Swal.fire({
					title: 'Tem certeza?',
					text: "Você ainda será capaz de reverter isso, apenas selecionando o usuário novamente!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Sim, quero remover!',
					cancelButtonText: 'Cancelar'
				}).then((result) => {
					if (result.isConfirmed) {
						
						this.forms.setValuesUser(indice, false);
						
						toastr.warning(`<b>${nome}</b> removido da lista`, 'Atenção!', {
							positionClass: "toast-top-right",
							closeButton: true
						});
					}
				})
			}else{
				toastr.warning(`Não existem dados a serem removidos`, 'Atenção!', {
					positionClass: "toast-top-right",
					closeButton: true
				});
			}

	   	} catch(ex){
    		this.utils.handleError('Erro ao limpar os dados do Dependente', ex);
    	} 
    },
    
    
    /**
     * Adiciona uma nova linha na tabela dinâmica de Endereços
     * @return {void}
     * @author Sérgio Machado
     */
    executeAddRowEnd: function(htmlElement, event) {
    	try{
			const tableId = 'tableEnderecos'; 
			this.forms.addRowTable(tableId, indexes['enderecos']).then((indice) =>{
				indexes['enderecos'] = indice;
				this.forms.addMasksFormTableEnd(indice);
				this.forms.addRulesFormTableEnd(indice);
				this.forms.countRowsTable(tableId);
				
				// Encontra a última linha da tabela e desliza atéo final do modal
				const tabela = document.querySelector(`#${tableId}`);
  				const ultimaLinha = tabela.rows[tabela.rows.length - 1];
				ultimaLinha.scrollIntoView({ behavior: 'smooth' });
			})
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	} 
    },
    
    
     /**
     * Remove uma linha específica da tabela dinâmica de Endereços
     * @return {void}
     * @author Sérgio Machado
     */
    executeRemoveRowEnd: function(htmlElement, event) {
    	try{
			const tabelaId = $(htmlElement).closest('table')[0].id;
			Swal.fire({
				title: 'Tem certeza?',
				text: "Você ainda será capaz de reverter isso, apenas atualizando a página!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sim, quero remover!',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.isConfirmed) {
					
					this.forms.removeRowTable(htmlElement).then(() =>{
						toastr.warning('Endereço removido da lista', 'Atenção!', {
							positionClass: "toast-top-right",
							closeButton: true
						});

						this.forms.countRowsTable(tabelaId);
		
					});
				}
			})
	   	} catch(ex){
    		this.utils.handleError('Erro', ex);
    	} 
    },
    
    
    /**
	 * Executa funções ao carregar a widget de forma sincronizada
	 * @return {Promise}
	 * @author Sérgio Machado
	 */
	initSync: function() {
		let self = this;
	  	return new Promise(async (resolve, reject) => {
	    	try {
				await self.initCalendar();
	      		await self.services.geCurrentUser();
	      		await self.executeGetAll();
	       		resolve(true);
	    	} catch (ex) {
	      		reject(ex);
	    	}
		});
	},
	
	
	/**
	 * Inicializa o componente FLUIGC.calendar
	 * @return {Promise}
	 * @author Sérgio Machado
	 */
 	initCalendar: function(){
    	let self = this;
		return new Promise(function(resolve, reject) {
			try {
			
				FLUIGC.calendar('#dataCadastroDe', {
		    		maxDate: new Date().toLocaleDateString('pt-BR'),
		            defaultDate: new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('pt-BR')
		    	});
		    	
		    	FLUIGC.calendar('#dataCadastroAte',{
		    		defaultDate: new Date()
		    	});
    	
			    resolve()    
			} catch (ex) {
				reject(ex)
			} 
		})
	},

	/**
	 * Carrega a lista de registros
	 * @return {Promise}
	 * @author Sérgio Machado
	 */
 	executeGetAll: function(){
    	let self = this;
		return new Promise(async function(resolve, reject) {
			try {
			    let constraints = [];
			    let dataCadastroDe = moment($('#dataCadastroDe').val(), "DD/MM/YYYY").format('YYYY/MM/DD');
			    let dataCadastroAte = moment($('#dataCadastroAte').val(), "DD/MM/YYYY").format('YYYY/MM/DD');
			    
				if (dataCadastroDe && dataCadastroAte){
		    		constraints.push(self.utils.createConstraint("dataCadastro", dataCadastroDe, dataCadastroAte));
		    	}
    	
			   	constraints.push(self.utils.createConstraint('method', 'read'));
		    	constraints.push(self.utils.createConstraint('readingType', 'getAll'));
			    const dados = await self.services.getAll(constraints);
			    await self.dataTables.exibirDados(dados);
			    resolve(true)    
			} catch (ex) {
				reject(ex)
			} 
		})
	},
	
    /**
	 * Monta os dados para criar um novo registro
	 * @param {object} formData Parâmetro obrigatório, Lista de campos e valores do formulário
	 * @param {object} modal Parâmetro obrigatório, modal do formulário
	 * @return {Promise}
	 * @author Sérgio Machado
	 */
    executeCreate: function(formData, modal) {
		let self = this;
		return new Promise(async function(resolve) {
			try {
				self.loading.show();
				let constraints = [];
				constraints.push(self.utils.createConstraint('method', 'create'));
				
				// Adiciona campos e valores do formulário no array de constraints
				for (let prop in formData) {
					constraints.push(self.utils.createConstraint(`${prop}`, `${formData[prop]}`));
				}
				   	
		      	const documentId = await self.services.create(constraints);
		      	self.executeGetAll();
	      		modal.remove();
				toastr.success(`Registro <b>${documentId}</b> cadastrado com sucesso`, 'Criado!', {
					positionClass: "toast-top-right",
					closeButton: true
				});
				
				resolve(true);
		
			} catch (ex) {
				self.utils.handleError('Erro ao cadastrar o registro', ex);
			} finally {
				self.loading.hide();
			}
		})
	},
	
	/**
     * Busca os dados do registro selecionado e abre o modal de visualização
     * @return {void}
     * @author Sérgio Machado
     */
    openModalFormView: function(htmlElement, event) {
    	try{
			this.loading.show();
			const documentId = htmlElement.getAttribute('data-documentId');

			this.getCardData(documentId).then((data) => {

				this.modals.modalFormView(data);
			    
			}).catch((ex) => {
				this.utils.handleError('Erro ao obter dados do registro', ex)
			}); 
			
    	} catch(ex){
			this.utils.handleError('Houve um erro inesperado', ex)
    	} 
    },
    
	/**
     * Abre o modal de atualização do registro
     * @return {void}
     * @author Sérgio Machado
     */
    openModalFormUpdate: function(htmlElement, event) {
    	try{
			this.loading.show();
			const documentId = htmlElement.getAttribute('data-documentId');

			this.getCardData(documentId).then((data) => {
				
				this.modals.modalFormUpdate(data);
			    
			}).catch((ex) => {
				this.utils.handleError('Erro ao obter dados do registro', ex)
			});

    	} catch(ex){
			this.utils.handleError('Houve um erro inesperado', ex)
    	} 
    },
    
    /**
     * Retorna objeto com dados do formulário principal e lista de dados das tabelas dinâmicas
     * @param {string | number} documentId Parâmetro obrigatório, Código do registro do formulário
     * @return {Promise}
     * @author Sérgio Machado
     */
    getCardData: function(documentId){
		let self = this;
		return new Promise(function(resolve, reject) {
			let constraints = [];
			constraints.push(self.utils.createConstraint('method', 'read'));
			constraints.push(self.utils.createConstraint('readingType', 'getById'));
			constraints.push(self.utils.createConstraint('documentId', documentId));
			
			// Define as variáveis para as Promises
			const principal = self.services.getByDocumentId(constraints); 
			const enderecos = self.services.getAdressByDocumentId(documentId); 
			const dependentes = self.services.getDependentsByDocumentId(documentId); 
			
			// Passa as variáveis para a Promise.all executar todas elas
			Promise.all([principal, enderecos, dependentes]).then((result) => {
				const data = {
			    	...result[0], // Dados do formulário
			    	enderecos: result[1], // Dados da tabela dinâmica de Endereços
			    	dependentes: result[2] // Dados da tabela dinâmica de Dependentes
			    };
			    
				resolve(data)
				
			}).catch((ex) => {
				reject(ex)
			});
		})	
	},
    
    
	/**
	 * Monta os dados para atualizar um registro específico
	 * @param {number | string} documentId Parâmetro obrigatório, documentId do registro
	 * @param {object} formData Parâmetro obrigatório, Lista de campos e valores do formulário
	 * @param {object} modal Parâmetro obrigatório, modal do formulário
	 * @return {Promise}
	 * @author Sérgio Machado
	 */
    executeUpdate: function(documentId, formData, modal) {
		let self = this;
		return new Promise(async function(resolve, reject) {
			try {
				self.loading.show();
				let constraints = [];
				constraints.push(self.utils.createConstraint('method', 'update'));
				constraints.push(self.utils.createConstraint('documentId', documentId));
				
				// Adiciona campos e valores do formulário no array de constraints
				for (let prop in formData) {
					constraints.push(self.utils.createConstraint(`${prop}`, `${formData[prop]}`));
				}
			   	
		      	await self.services.update(constraints)
				await self.executeGetAll();
				modal.remove();
				toastr.success(`Registro <b>${documentId}</b> atualizado com sucesso`, 'Atualizado!', {
					"positionClass": "toast-top-right",
					"closeButton": true,
				});
				
				resolve(true)
		
			} catch (ex) {
				self.utils.handleError('Erro ao atualizar o registro', ex);
				reject(ex)
			}finally {
			  self.loading.hide();
			} 
		})
	},
	
	/**
	 * Deletar um registro específico
	 * @return {void}
	 * @author Sérgio Machado
	 */
    executeDestroy: function(htmlElement, event) {
		let self = this;
		const documentId = htmlElement.getAttribute('data-documentId');
		Swal.fire({
		    title: 'Tem certeza?',
		  	text: "Você não será capaz de reverter isso!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Sim, quero deletar!',
		  	cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				this.loading.show();
				
				let constraints = [];
				constraints.push(this.utils.createConstraint('method', 'destroy'));
				constraints.push(this.utils.createConstraint('documentId', documentId));
        
		 		this.services.destroy(constraints).then((response) =>{
    				toastr.success(`Registro <b>${documentId}</b> deletado com sucesso.`, 'Deletado!', {
						"positionClass": "toast-top-right",
						"closeButton": true,
					});
					
					self.executeGetAll();
					
		      	}).catch((ex) => {
					this.utils.handleError('Erro ao excluir o registro', ex);

				}).finally(() => {
					this.loading.hide();
				});
			    	
		  	}
		})
	},
	
 });