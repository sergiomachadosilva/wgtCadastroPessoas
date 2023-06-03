/**
 * Renderiza dados na tabela usando a biblioteca DataTables
 * @param {object[]} dados Parâmetro obrigatório, Lista de dados
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.dataTables.exibirDados = function(dados){
  	let self = this;
  	return new Promise((resolve, reject) => {
    	try{
		    $('#tabela').DataTable({
	            data: dados,
	            processing: true,
	            responsive: true,
	    		dom: 'Bfr<"fs-full-width fs-sm-margin-bottom table-responsive"t>ip',
	            buttons: [
					{
			            text: '<i class="flaticon flaticon-add-plus" aria-hidden="true"></i> Novo',
			            className: 'btn btn-success btn-incluir fs-sm-margin-right',
			            action: function () {
			                self.modals.modalFormCreate();
			            },
			        },
			    	{
			            text: '<i class="fluigicon fluigicon-file-xlsx icon-md" aria-hidden="true"></i>',
			            className: 'btn btn-sm fs-sm-margin-right',
			            extend: 'excel',
			            filename: 'dados-relatorio',
			        },
			        {
			            text: '<i class="fluigicon fluigicon-file-pdf icon-md" aria-hidden="true"></i>',
			            className: 'btn btn-sm btn-pdf fs-sm-margin-right',
			            action: async function () {
							try {
								self.loading.show();
					    		let constraints = [];
					    		
					    		let dataCadastroDe = moment($('#dataCadastroDe').val(), "DD/MM/YYYY").format('YYYY/MM/DD');
							    let dataCadastroAte = moment($('#dataCadastroAte').val(), "DD/MM/YYYY").format('YYYY/MM/DD');
							    
								if (dataCadastroDe && dataCadastroAte){
						    		constraints.push(self.utils.createConstraint("dataCadastro", dataCadastroDe, dataCadastroAte));
						    	}
						    	
					    		constraints.push(self.utils.createConstraint('method', 'read'));
	    						constraints.push(self.utils.createConstraint('readingType', 'getAll'));
	    						
	    						let dados = await self.services.getAll(constraints);
	    						self.pdfMake.generatePDF(dados)
	    						
							} catch (ex) {
								self.utils.handleError('Erro ao obter lista de dados', ex);
							} finally {
								self.loading.hide();
							}
			            },
			        },
			        {
			            text: '<i class="flaticon flaticon-refresh icon-md" aria-hidden="true"></i>',
			            className: 'btn btn-sm btn-atualizar',
			            action: async function () {
							try {
								self.loading.show();
								await self.executeGetAll();
							} catch (ex) {
								self.utils.handleError('Erro ao recarregar os dados', ex);
							} finally {
								self.loading.hide();
							}
			            },
			        }
	            ],
			    initComplete: function () {
			        $('.buttons-excel').removeClass('dt-button').prop('title', 'Exportar para Excel');
			        $('.btn-incluir').removeClass('dt-button').prop('title', 'Incluir novo registro');
			        $('.btn-pdf').removeClass('dt-button').prop('title', 'Gerar PDF');
			        $('.btn-atualizar').removeClass('dt-button').prop('title', 'Recarregar dados');
			    },
	            columns: [
	    			{
	                    data: null,
	    				className: 'count text-nowrap fs-v-align-middle',
	                    render: function (data, type, row, meta) {
	                        return meta.row + meta.settings._iDisplayStart + 1;
	                    }
	                },
	                { data: 'documentId', className: 'text-nowrap fs-v-align-middle'},
	                { data: 'dataCriacao', className: 'text-nowrap fs-v-align-middle'},
	                { data: 'usuarioCriacao', className: 'text-nowrap fs-v-align-middle'},
	                { data: 'nome', className: 'text-nowrap fs-v-align-middle'}, 
	                { data: 'profissao', className: 'text-nowrap fs-v-align-middle'}, 
	                { data: 'dataNascimento', className: 'text-nowrap fs-v-align-middle'},
	                { data: 'atividadeRemuneradaText', className: 'text-nowrap fs-v-align-middle'},
	                {
	                	className: 'text-nowrap text-center fs-v-align-middle btn-actions',
	                	render: function ( data, type, row, meta ) {
				           let btnVisualizar = `<button 
	                		class="btn btn-info fs-sm-margin-right" 
	                		data-view data-documentId=${row.documentId} 
	                		title="Visualizar Registro">
	                		<i class="flaticon flaticon-view" aria-hidden="true"></i></button>`;
	                		
	                		let btnAtualizar = `<button 
	                		class="btn btn-warning fs-sm-margin-right" 
	                		data-update data-documentId=${row.documentId} 
	                		title="Atualizar Registro">
	                		<i class="flaticon flaticon-edit" aria-hidden="true"></i></button>`;
	                		
	                		let btnDestroy = `<button 
	                		class="btn btn-danger" 
	                		data-destroy 
	                		data-documentId=${row.documentId} 
	                		title="Deletar Registro">
	                		<i class="flaticon flaticon-trash" aria-hidden="true"></i></button>`;
	                		
	                		return `${btnVisualizar} ${btnAtualizar} ${btnDestroy}`;
	    	        	}
	    	        }
	
	            ],
	            order: [],
	            pagingType: "numbers",
	            pageLength: 25,
	            language: {
	                lengthMenu: "Mostrar _MENU_ registros",
	                info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
	                infoEmpty: "Mostrando 0 até 0 de 0 registros",
	                infoFiltered: "(Filtrados de _MAX_ registros)",
	                loadingRecords: "Carregando...",
	                processing: "Processando...",
	                search: "Pesquisar:",
	                zeroRecords: function(){
						return $('<div>')
    						.addClass('text-center')
    						.append(
								$('<img>')
    							.attr('src', '/wgt_crud_01/resources/images/not-found.svg')
    							.css({
							        'max-width': '175px',
							        'margin': '20px 0',
							      })
    							)
    						.append($('<p>').text('Nenhum registro foi encontrado para sua busca'));
					},
	                emptyTable: function(){
		  			
		  				var btnOpenModal = $('<button>').addClass('btn btn-success btn-xs fs-md-margin-bottom')
                        .append($('<i>').addClass('flaticon flaticon-add-plus').attr('aria-hidden', 'true'))
                        .append(' Adicionar Primeiro Registro')
                        .on('click', function() {
                       		self.modals.modalFormCreate();
                        });
                         
						return $('<div>')
    						.addClass('text-center')
    						.append(
								$('<img>')
    							.attr('src', '/wgt_crud_01/resources/images/empyt-list.svg')
    							.css({
							        'max-width': '115px',
							        'margin': '20px 0',
							      })
    							)
    						.append($('<p>').text('A lista não possui registros publicados no momento'))
    						.append(btnOpenModal);
					},
	                paginate: {
	                    first: "Primeiro",
	                    last: "Útimo",
	                    next: "Próximo",
	                    previous: "Anterior"
	                },
	                aria: {
	                    sortAscending: ": Clicar para ordenar a coluna de maneira crescente",
	                    sortDescending: ": Clicar para ordenar a coluna de maneira decrescente"
	                },
	            },
	            bDestroy: true
	        });
	     	resolve(true);   
		}catch(ex){
			this.utils.handleError('Ocorreu um erro ao renderizar os dados na tabela', ex);
			reject(ex)
		}
	});	
}.bind(MyWidget);


/**
 * Renderiza lista de usuário utilizando o componente datatable do Fluig
 * @param {number | string} indice Parâmetro obrigatório, Indíce da linha da tabela dinâmica
 * @param {object[]} users Parâmetro obrigatório, Lista de usuários do fluig
 * @param {object} modal Parâmetro obrigatório, Modal onde esta sendo redenrizada a lista 
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.dataTables.usersFluig = function(indice, users, modal){
  	let self = this;
  	return new Promise((resolve, reject) => {
    	try{
			var myTable = FLUIGC.datatable(`#${modal.idModal} #renderDataTable`, {
				dataRequest: users,
				renderContent: '.dataTableUsers',
				header: [
					{ 'title': '#', 'size': 'text-center'},
					{ 'title': '#', 'size': 'text-center' },
					{ 'title': 'Nome' },
					{ 'title': 'Matrícula' },
					{ 'title': 'Login' },
					{ 'title': 'E-Mail' },
					{ 'title': 'Ativo' },
					{ 'title': 'Administrador' }
				],
				classSelected: 'success',
				tableStyle: 'table-hover table-striped',
				emptyMessage: '<div class="text-center">Nenhum Usuário encontrado</div>',
				search: {
					enabled: true,
					onlyEnterkey: false,
					onSearch: function(res) {
						if (!res) {
							myTable.reload(dataInit);
						}
						var dataAll = myTable.getData();
						var search = dataAll.filter(function(el) {
							return el.nome.toUpperCase().indexOf(res.toUpperCase()) >= 0
							|| el.email.toUpperCase().indexOf(res.toUpperCase()) >= 0
							|| el.login.toUpperCase().indexOf(res.toUpperCase()) >= 0;
						});
						if (search && search.length) {
							myTable.reload(search);
						} else {
							toastr.warning('Nenhum resultado encontrado para sua busca', 'Atenção!', {
								positionClass: "toast-top-right",
								closeButton: true
							});
							myTable.reload([]);
						}
					}
				},
				actions: {
			        enabled: true,
			        template: '.messageDataTableUsers',
			        actionAreaStyle: 'col-md-6'
			    },
				navButtons: {
					enabled: false,
				},
				
			}, function(err, data) {
				if (!err) {
					dataInit = data;
					$(`#${modal.idModal} .btnInserir`).on('click', () => {

						if(myTable.selectedRows().length){
							let user = myTable.getRow(myTable.selectedRows()[0])
						
							self.forms.userIsDuplicate(user.matricula).then((result) =>{
								
								self.forms.setValuesUser(indice, user);
								modal.instancia.remove();
								
								toastr.success(`<b>${user.nome}</b> adicionado à lista`, 'OK', {
									positionClass: "toast-top-right",
									closeButton: true
								});
								
							}).catch((ex) =>{
								console.error(ex)
								toastr.warning(`<b>${user.nome}</b> já está inserido na lista`, 'Atenção!', {
									positionClass: "toast-top-right",
									closeButton: true
								});
							});
												
						}else{
							toastr.warning('Selecione um Usuário', 'Atenção!', {
								positionClass: "toast-top-right",
								closeButton: true
							});
						}
					})
					resolve(true)
				}
			});
		}catch(ex){
			reject(ex)
		}
	});
  	
}.bind(MyWidget);