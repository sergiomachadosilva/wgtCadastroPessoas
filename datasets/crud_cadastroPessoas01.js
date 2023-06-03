function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();

	try {
		var companyId = java.lang.Integer(fluigAPI.getSecurityService().getCurrentTenantId())
		var datasetForm = "form_cadastroPessoas01"; // Dataset do formulário de cadastro
		var method = getConstraint(constraints, "method");
		var documentId = getConstraint(constraints, "documentId");
		
		if(!method){
			throw "Constraint method não informada";
		}else if((method != "create") && (method != "read") && (method != "update") && (method != "destroy")){
			throw "Valor não aceito para a constraint method";
		}
		
		
		// Cria um novo registro
		if(method == "create"){
			// Obtém o código do formulário
			var parentDocumentId = getIdForm(companyId, datasetForm);
			
			if(!parentDocumentId){
				throw "Código do formulário não encontrado para o dataset do formulário";
			}
			
			// Executa a função para criar um novo registro
			var result = createCard(java.lang.Integer(parentDocumentId), constraints);
			
			dataset.addColumn('documentId');
			dataset.addRow([result]);
		} 
		
		// Ler registros
		if(method == "read"){
			var readingType = getConstraint(constraints, "readingType");
			
			if(!readingType){
				throw "Constraint readingType não informada";
			}else if((readingType != "getAll") && (readingType != "getById") && (readingType != "getAdressById")
			&& (readingType != "getDependentsById")){
				throw "Valor não aceito para a constraint readingType";
			}
			
			// Retorna todos os registros em um período de data
			if(readingType == "getAll"){
				
				var dataInicial = "";	
				var dataFinal = "";	
				
				for (var i = 0; i < constraints.length; i++) {
	                if (constraints[i].fieldName == "dataCadastro") {
						if((constraints[i].initialValue != "") && constraints[i].finalValue != ""){
							dataInicial = constraints[i].initialValue;
							dataFinal = constraints[i].finalValue;
							break;
						}
	                }
	            }
	            
	            if(dataInicial == "" || dataFinal == ""){
					throw "Data Inicial ou Final não foi informada";
				}
            
				dataset = getAllCardData(datasetForm, dataInicial, dataFinal);
			}
			
			// Retorna os dados de um registro específico
			if(readingType == "getById"){
				if(!documentId){
					throw "Constraint documentId não informada";
				}
				dataset = getCardDataById(datasetForm, documentId);
			}
			
			// Retorna a lista de Dependentes de um registro específico
			if(readingType == "getDependentsById"){
				if(!documentId){
					throw "Constraint documentId não informada";
				}
				dataset = getCardDataDependentsById(datasetForm, documentId);
			}
			
			// Retorna a lista de Endereços de um registro específico
			if(readingType == "getAdressById"){
				if(!documentId){
					throw "Constraint documentId não informada";
				}
				dataset = getCardDataAdressById(datasetForm, documentId);
			}			

		}
		
		
		// Atualiza um registro específico
		if(method == "update"){
			if(!documentId){
				throw "Constraint documentId não informada";
			}
			
			// Executa a função para atualizar o registro
			//var result = updateCard(documentId, constraints);
			var result = updateCardSDK(documentId, constraints);
			
			dataset.addColumn('status');
			dataset.addRow([result]);
		} 
		
		
		// Deleta um registro específico
		if(method == "destroy"){
			if(!documentId){
				throw "Constraint documentId não informada";
			}
			
			// Move o registro para a lixeira
			deleteCard(documentId);
			
			// Exclui o registro da lixeira
			destroyDocument(documentId);
			
			dataset.addColumn('status');
			dataset.addRow(['ok']);
		} 

	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}



/**
 * Cria um novo registro de formulário
 * @param {integer} parentDocumentId Parâmetro obrigatório, Id do formulário
 * @param {object[]} constraints Parâmetro obrigatório, lista de constraints
 * @return {string} Retorna o id do documento criando em caso de sucesso, caso contrário, retorna mensagem do erro
 * @author Sérgio Machado
 */
function createCard(parentDocumentId, constraints){
	try {
			// Usuário logado
			var usuarioLogado = getUsuario(getValue("WKUser"));
			
			// Cria instância do objeto getWebServiceFluig
			var webService = new getWebServiceFluig();
			// Chama o método getCardService
			var cardService = webService.getCardService();
		
			// Instancia as classe do serviço 
			var cardDtoArray = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardDtoArray");
			var cardDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardDto")
			var uuidDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto")
			var userCodeDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var userNameDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var criacaoDataDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var dataCriacaoISODto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			
		    // Seta informações do registro
		    cardDto.setParentDocumentId(parentDocumentId);
		    cardDto.setInheritSecurity(true);
    
		    // Percorre os campos e valores enviados através das contraints
			 for (i in constraints) {
				var item = constraints[i]
				var cardFieldDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				cardFieldDto.setField(item.getFieldName().trim());
		    	cardFieldDto.setValue(item.getInitialValue() != "null" ? item.getInitialValue() : null);
				cardDto.getCardData().add(cardFieldDto);
			}
			
			// Grava informações do usuário que esta criando o registro
			var uuid = new java.util.UUID.randomUUID(); // Gera código único não sequencial para o registro
			uuidDto.setField("uuid");
	    	uuidDto.setValue(uuid.toString());
	    	
			userCodeDto.setField("criacaoUserCode");
	    	userCodeDto.setValue(getValue("WKUser"));
	    	
	    	userNameDto.setField("criacaoUserNome");
	    	userNameDto.setValue(usuarioLogado.nome);
	    	
	    	criacaoDataDto.setField("criacaoData");
	    	criacaoDataDto.setValue(dataCorrente("dd/MM/yyyy HH:mm"));
	    	
	    	dataCriacaoISODto.setField("dataCriacaoISO");
	    	dataCriacaoISODto.setValue(dataCorrente("yyyy/MM/dd"));
	    	
	    	cardDto.getCardData().add(uuidDto);
	    	cardDto.getCardData().add(userCodeDto);
	    	cardDto.getCardData().add(userNameDto);
	    	cardDto.getCardData().add(criacaoDataDto);
	    	cardDto.getCardData().add(dataCriacaoISODto);
		   	cardDtoArray.getItem().add(cardDto);
			
		 	// Chama o método create para criar o registro do formulário
			var result = cardService.port.create(getValue("WKCompany"), webService.getLogin(), webService.getSenha(), cardDtoArray);
	
			var webServiceMessage = result.getItem().get(0).getWebServiceMessage();
			
			if(!webServiceMessage.equals("ok")){
				throw webServiceMessage;
			}
	
			var documentId = java.lang.Integer(result.getItem().get(0).getDocumentId());
			
			return documentId
		
	} catch (ex) {
		throw ex;
	}
}

/**
 * Retorna todos os registros
 * @param {string} datasetForm Parâmetro obrigatório, código do dataset do formulário
 * @param {string} dataInicial Parâmetro obrigatório, Data Inicial do cadastro do formato yyyy/MM/dd
 * @param {string} dataFinal Parâmetro obrigatório, Data Final do cadastro do formato yyyy/MM/dd
 * @param {object[]} constraints Parâmetro obrigatório, lista de constraints
 * @return {object[]} retorno novo dataset com os dados encontrados 
 * @author Sérgio Machado
 */
function getAllCardData(datasetForm, dataInicial, dataFinal){
	var dataset = DatasetBuilder.newDataset();
	try {
		
		dataset.addColumn('documentId');
		dataset.addColumn('uuid');
		dataset.addColumn('nome');
		dataset.addColumn('profissao');
		dataset.addColumn('dataNascimento');
		dataset.addColumn('atividadeRemunerada');
		dataset.addColumn('dataCriacao');
		dataset.addColumn('usuarioCriacao');
		dataset.addColumn('dataAtualizacao');
		dataset.addColumn('usuarioAtualizacao');
		
		var filtros = [];
		filtros.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('dataCriacaoISO', dataInicial, dataFinal, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('userSecurityId', 'TOTVS', 'TOTVS', ConstraintType.MUST));
		
		var result = DatasetFactory.getDataset(datasetForm, null, filtros, ['documentid;DESC']);
		
		if(result != null && result.getRowsCount() > 0){
			var erro = result.getValue(0, 'Mensagem');
			if(!erro){
				for (var i = 0; i < result.getRowsCount(); i++) {
					var documentId = result.getValue(i, 'documentid');
					var uuid = result.getValue(i, 'uuid');
					var nome = result.getValue(i, 'nome');
					var profissao = result.getValue(i, 'profissao');
					var dataNascimento = result.getValue(i, 'dataNascimento');
					var atividadeRemunerada = result.getValue(i, 'atividadeRemunerada');
					var dataCriacao = result.getValue(i, 'criacaoData');
					var usuarioCriacao = result.getValue(i, 'criacaoUserNome');
					var dataAtualizacao = result.getValue(i, 'atualizacaoData');
					var usuarioAtualizacao = result.getValue(i, 'atualizacaoUserNome');
			
					dataset.addRow([
						documentId,
						uuid,
						nome, 
						profissao, 
						dataNascimento,
						atividadeRemunerada,
						dataCriacao, 
						usuarioCriacao, 
						dataAtualizacao,
						usuarioAtualizacao
					]);
				}
			}else{
				throw erro;
			}
		}


	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}

/**
 * Retorna dados de um registro específico
 * @param {string} datasetForm Parâmetro obrigatório, código do dataset do formulário
 * @param {number | string} documentId Parâmetro obrigatório, Id do registro do formulário
 * @return {object[]} retorno novo dataset com os dados encontrados 
 * @author Sérgio Machado
 */
function getCardDataById(datasetForm, documentId){
	var dataset = DatasetBuilder.newDataset();
	try {
		
		dataset.addColumn('documentId');
		dataset.addColumn('uuid');
		dataset.addColumn('nome');
		dataset.addColumn('profissao');
		dataset.addColumn('dataNascimento');
		dataset.addColumn('atividadeRemunerada');
		dataset.addColumn('dataCriacao');
		dataset.addColumn('usuarioCriacao');
		dataset.addColumn('dataAtualizacao');
		dataset.addColumn('usuarioAtualizacao');
		
		var filtros = [];
		filtros.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('documentid', documentId, documentId, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('userSecurityId', 'TOTVS', 'TOTVS', ConstraintType.MUST));
		
		var result = DatasetFactory.getDataset(datasetForm, null, filtros, null);
		
		if(result != null && result.getRowsCount() > 0){
			var erro = result.getValue(0, 'Mensagem');
			if(!erro){
				//var documentId = result.getValue(i, 'documentid');
				var uuid = result.getValue(0, 'uuid');
				var nome = result.getValue(0, 'nome');
				var profissao = result.getValue(0, 'profissao');
				var dataNascimento = result.getValue(0, 'dataNascimento');
				var atividadeRemunerada = result.getValue(0, 'atividadeRemunerada');
				var dataCriacao = result.getValue(0, 'criacaoData');
				var usuarioCriacao = result.getValue(0, 'criacaoUserNome');
				var dataAtualizacao = result.getValue(0, 'atualizacaoData');
				var usuarioAtualizacao = result.getValue(0, 'atualizacaoUserNome');
		
				dataset.addRow([
					java.lang.Integer(documentId), 
					uuid,
					nome, 
					profissao, 
					dataNascimento,
					atividadeRemunerada,
					dataCriacao, 
					usuarioCriacao,
					dataAtualizacao,
					usuarioAtualizacao
				]);

			}else{
				throw erro;
			}
		}else{
			throw "Registro não encontrado";
		}


	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}

/**
 * Retorna dados da tabela pai e filho de Dependentes de um registro específico
 * @param {string} datasetForm Parâmetro obrigatório, código do dataset do formulário
 * @param {number | string} documentId Parâmetro obrigatório, Id do registro do formulário
 * @return {object[]} retorno novo dataset com os dados encontrados 
 * @author Sérgio Machado
 */
function getCardDataDependentsById(datasetForm, documentId){
	var dataset = DatasetBuilder.newDataset();
	try {
		
		dataset.addColumn('nome');
		dataset.addColumn('matricula');
		dataset.addColumn('login');
		dataset.addColumn('email');
		
		var filtros = [];
		filtros.push(DatasetFactory.createConstraint('tablename', 'dependentes', 'dependentes', ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('documentid', documentId, documentId, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('userSecurityId', 'TOTVS', 'TOTVS', ConstraintType.MUST));
		
		var result = DatasetFactory.getDataset(datasetForm, null, filtros, null);
		
		if(result != null && result.getRowsCount() > 0){
			var erro = result.getValue(0, 'Mensagem');
			if(!erro){
				for (var i = 0; i < result.getRowsCount(); i++) {
					var nome = result.getValue(i, 'dependenteNome');
					var matricula = result.getValue(i, 'dependenteMatricula');
					var login = result.getValue(i, 'dependenteLogin');
					var email = result.getValue(i, 'dependenteEmail');

					dataset.addRow([nome, matricula, login, email]);
				}
			}else{
				throw erro;
			}
		}

	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}


/**
 * Retorna dados da tabela pai e filho de endereços de um registro específico
 * @param {string} datasetForm Parâmetro obrigatório, código do dataset do formulário
 * @param {number | string} documentId Parâmetro obrigatório, Id do registro do formulário
 * @return {object[]} retorno novo dataset com os dados encontrados 
 * @author Sérgio Machado
 */
function getCardDataAdressById(datasetForm, documentId){
	var dataset = DatasetBuilder.newDataset();
	try {
		
		dataset.addColumn('cep');
		dataset.addColumn('endereco');
		dataset.addColumn('numero');
		dataset.addColumn('bairro');
		dataset.addColumn('cidade');
		dataset.addColumn('estado');

		
		var filtros = [];
		filtros.push(DatasetFactory.createConstraint('tablename', 'enderecos', 'enderecos', ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('metadata#active', true, true, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('documentid', documentId, documentId, ConstraintType.MUST));
		filtros.push(DatasetFactory.createConstraint('userSecurityId', 'TOTVS', 'TOTVS', ConstraintType.MUST));
		
		var result = DatasetFactory.getDataset(datasetForm, null, filtros, null);
		
		if(result != null && result.getRowsCount() > 0){
			var erro = result.getValue(0, 'Mensagem');
			if(!erro){
				for (var i = 0; i < result.getRowsCount(); i++) {
					var cep = result.getValue(i, 'cep');
					var endereco = result.getValue(i, 'endereco');
					var numero = result.getValue(i, 'numero');
					var bairro = result.getValue(i, 'bairro');
					var cidade = result.getValue(i, 'cidade');
					var estado = result.getValue(i, 'estado');
					dataset.addRow([cep, endereco, numero, bairro, cidade, estado]);
				}
			}else{
				throw erro;
			}
		}

	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}


/**
 * Atualiza valores de campos de um registro de formulário com tabela pai e filho
 * @param {number | string} documentId Parâmetro obrigatório, Id do registro do formulário
 * @param {object[]} constraints Parâmetro obrigatório, lista de constraints
 * @link https://github.com/sergiomachadosilva/fluig-utils/tree/main/api-sdk/getCardAPIService/edit
 * @return {string} Retorna 'OK' em caso de sucesso, caso contrário, retorna mensagem do erro
 * @author Sérgio Machado
 */
function updateCardSDK(documentId, constraints){
	try {
			// Usuário logado
			var usuarioLogado = getUsuario(getValue("WKUser"));
			
			// Lista com os campos do formulário que serão alterados ou adicionanos no caso de tabela dinâmica
	    	var ficha = new java.util.ArrayList();
		
			// Objetos cardFieldVO
			var userCodeDto = new com.fluig.sdk.api.cardindex.CardFieldVO();
			var userNameDto = new com.fluig.sdk.api.cardindex.CardFieldVO();
			var atualizacaoDataDto = new com.fluig.sdk.api.cardindex.CardFieldVO();
		  	
		  	 // Percorre os campos e valores enviados através das contraints
			 for (i in constraints) {
				var item = constraints[i]
				var cardFieldDto = new com.fluig.sdk.api.cardindex.CardFieldVO();
				var inputName = item.getFieldName().trim();
				
				// Pula os campos que não devem ser atualizados
				if(inputName != "uuid" && inputName != "criacaoUserCode" && inputName != "criacaoUserNome" && 
				inputName != "criacaoData" && inputName != "dataCriacaoISO"){
					cardFieldDto.setFieldId(item.getFieldName().trim());
		    		cardFieldDto.setValue(item.getInitialValue() != "null" ? item.getInitialValue() : null);
					// Adiciona o campo no array de fichas
		  			ficha.add(cardFieldDto)
				}
			}
			
			// Grava informações do usuário que esta atualizando o registro
			userCodeDto.setFieldId("atualizacaoUserCode");
	    	userCodeDto.setValue(getValue("WKUser"));
	    	
	    	userNameDto.setFieldId("atualizacaoUserNome");
	    	userNameDto.setValue(usuarioLogado.nome);
	    	
	    	atualizacaoDataDto.setFieldId("atualizacaoData");
	    	atualizacaoDataDto.setValue(dataCorrente("dd/MM/yyyy HH:mm"));
	    	    	
	    	ficha.add(userCodeDto);
	    	ficha.add(userNameDto);
	    	ficha.add(atualizacaoDataDto);
    
		 	// Executa o serviço para alterar os campos do formulário 
	    	fluigAPI.getCardAPIService().edit(java.lang.Integer(documentId), ficha)
				
			return 'OK'
		
	} catch (ex) {
		throw ex;
	}
}


/**
 * Atualiza valores de campos de um registro de formulário
 * @param {number | string} documentId Parâmetro obrigatório, Id do registro do formulário
 * @param {object[]} constraints Parâmetro obrigatório, lista de constraints
 * @return {string} Retorna 'OK' em caso de sucesso, caso contrário, retorna mensagem do erro
 * @author Sérgio Machado
 */
function updateCard(documentId, constraints){
	try {
			// Usuário logado
			var usuarioLogado = getUsuario(getValue("WKUser"));
			
			// Cria instância do objeto getWebServiceFluig
			var webService = new getWebServiceFluig();
			// Chama o método getCardService
			var cardService = webService.getCardService();
		
			// Instancia as classe do serviço 
			var cardFieldDtoArray = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDtoArray")
			var userCodeDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var userNameDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
			var atualizacaoDataDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
		  	
		  	 // Percorre os campos e valores enviados através das contraints
			 for (i in constraints) {
				var item = constraints[i]
				var cardFieldDto = cardService.helper.instantiate("com.totvs.technology.ecm.dm.ws.CardFieldDto");
				cardFieldDto.setField(item.getFieldName().trim());
		    	cardFieldDto.setValue(item.getInitialValue() != "null" ? item.getInitialValue() : null);
				// Adiciona os campos no array
		  		cardFieldDtoArray.getItem().add(cardFieldDto);
			}
			
			// Grava informações do usuário que esta atualizando o registro
			userCodeDto.setField("atualizacaoUserCode");
	    	userCodeDto.setValue(getValue("WKUser"));
	    	
	    	userNameDto.setField("atualizacaoUserNome");
	    	userNameDto.setValue(usuarioLogado.nome);
	    	
	    	atualizacaoDataDto.setField("atualizacaoData");
	    	atualizacaoDataDto.setValue(dataCorrente("dd/MM/yyyy HH:mm"));
	    	
	    	
	    	cardFieldDtoArray.getItem().add(userCodeDto);
	    	cardFieldDtoArray.getItem().add(userNameDto);
	    	cardFieldDtoArray.getItem().add(atualizacaoDataDto);
    
		 	// Chama o método updateCardData para atualizar o registro do formulário
			var result = cardService.port.updateCardData(getValue("WKCompany"), webService.getLogin(), webService.getSenha(), documentId, cardFieldDtoArray);
	
			var webServiceMessage = result.getItem().get(0).getWebServiceMessage();
			
			if(!webServiceMessage.equals("ok")){
				throw webServiceMessage;
			}
			
			return webServiceMessage
		
	} catch (ex) {
		throw ex;
	}
}

/**
 * Move um registro de formulário para a lixeira
 * @param {number | string} documentId Parâmetro obrigatório, Id de registro do formulário
 * @return {string} Retorna 'OK' em caso de sucesso, caso contrário, retorna mensagem do erro
 * @author Sérgio Machado
 */
function deleteCard(documentId){
	try {

		// Cria instância do objeto getWebServiceFluig
		var webService = new getWebServiceFluig();
		// Chama o método getCardService
		var cardService = webService.getCardService();

		// Executa o método deleteCard responsável por enviar o registro para a lixeira
		var result = cardService.port.deleteCard(getValue("WKCompany"), webService.getLogin(), webService.getSenha(), documentId);

		var webServiceMessage = result.getItem().get(0).getWebServiceMessage();
		
		if(!webServiceMessage.equals("ok")){
			throw webServiceMessage;
		}

		return webServiceMessage;
		
	} catch (ex) {
		throw ex;
	}
}


/**
 * Exclui um documento da lixeira
 * @param {number | string} documentId Parâmetro obrigatório, Id de registro do formulário
 * @return {string} Retorna 'OK' em caso de sucesso, caso contrário, retorna mensagem do erro
 * @author Sérgio Machado
 */
function destroyDocument(documentId){
	try {

		// Cria instância do objeto getWebServiceFluig
		var webService = new getWebServiceFluig();
		// Chama o método getCardService
		var documentService = webService.getDocumentService();

		// Executa o método destroyDocument responsável excluir o registro da lixeira
		var result = documentService.port.destroyDocument(webService.getLogin(), webService.getSenha(), getValue("WKCompany"), documentId, webService.getMatricula());

		var webServiceMessage = result.getItem().get(0).getWebServiceMessage();
		
		if(!webServiceMessage.equals("ok")){
			throw webServiceMessage;
		}

		return webServiceMessage;
		
	} catch (ex) {
		throw ex;
	}
}

/**
 * Retorna a data atual formatada
 * @param {String} format Parâmetro obrigatório, formato de retorno da data
 * @return {String} Retorna a data atual formatada
 * @author Sérgio Machado
 */
function dataCorrente(format) {
	try {
		var locale = java.util.Locale("pt", "BR");
		var hoje = java.util.Calendar.getInstance();
		var dt = (java.text.SimpleDateFormat(format, locale)).format(hoje.getTime());
		return dt;
	} catch (ex) {
		throw "function " + arguments.callee.name + " => " + ex.toString();
	}
}


/**
 * Obtém dados do usuário corrente
 * @param {string} matricula Parâmetro obrigatório, matrícula do usuário
 * @return {string}
 * @author Sérgio Machado
 */
function getUsuario(matricula) {
	var constraints = [];
	constraints.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", matricula, matricula, ConstraintType.MUST))
	var dataset = DatasetFactory.getDataset("colleague", null, constraints, null);

	return{
		matricula: matricula,
		nome: String(dataset.getValue(0, "colleagueName")),
		email: String(dataset.getValue(0, "mail")),
		login: String(dataset.getValue(0, "login")),
	}
}


/**
 * Retorna o valor initialValue de uma determinada constraint
 * @param {object} constraints Parâmetro obrigatório, constraints recebidas no dataset
 * @param {String} campo Parâmetro obrigatório, constraint que deseja obter o valor
 * @returns {String|boolean} 
 */
function getConstraint(constraints, campo) {
	if ((constraints != null) && (constraints.length > 0)) {
		for (i in constraints) {
			var constraint = constraints[i]
			if (constraint.getFieldName().trim().toUpperCase() == campo.trim().toUpperCase()) {
				return constraint.getInitialValue();
			}
		}
	}
	return false;
}


/**
 * Obtém o código do formulário com base no dataset do formulário e id da empresa
 *
 * OBS: Se esta consulta não retornar o código do formulário mesmo o dataset estando correto
 * altere a condição VERSAO_ATIVA = 'true' para VERSAO_ATIVA = true
 * Observei que isso ocorre quando o banco de dados é MySql
 *
 * @param {Number} companyId Parâmetro obrigatório, id da empresa
 * @param {String} datasetName Parâmetro obrigatório, dataset do formulário
 * @returns {Number| Boolean} Retorna código do formulário
 * @author Sérgio Machado
 */
function getIdForm(companyId, datasetName) {
	try {
		
		// Monta a sentença sql
		var sentencaSQL = "SELECT NR_DOCUMENTO FROM DOCUMENTO WHERE COD_EMPRESA = '"+companyId+"'";
		sentencaSQL += " AND VERSAO_ATIVA = 'true' AND NM_DATASET = '" + datasetName + "';";

		// Executa a sentença sql no banco
		var result = consultarBanco(sentencaSQL);

		if (result.getRowsCount() > 0) {
			return result.getValue(0, 'NR_DOCUMENTO');
		}
		return false

	} catch (ex) {
		log.error("Houve um erro ao executar a função getIdForm")
		log.error(ex)
		throw "function " + arguments.callee.name + " => " + err.toString();
	}
}


/**
 * Realiza consulta no próprio banco de dado do Fluig para obter a metaListId da tabela pai e filho
 * @param {String} sentencaSQL Parâmetro obrigatório, consulta sql para ser executada
 * @return {object} Retorna um dataset contendo as colunas e registros da consulta
 * @author TOTVS
 * @author Sérgio Machado
 */
function consultarBanco(sentencaSQL) {

	var newDataset = DatasetBuilder.newDataset();
	var dataSource = "java:/jdbc/AppDS";
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	var created = false;
	try {
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		var rs = stmt.executeQuery(sentencaSQL);
		var columnCount = rs.getMetaData().getColumnCount();
		while (rs.next()) {
			if (!created) {
				for (var i = 1; i <= columnCount; i++) {
					newDataset.addColumn(rs.getMetaData().getColumnLabel(i));
				}
				created = true;
			}
			var Arr = new Array();
			for (var i = 1; i <= columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnLabel(i));
				if (null != obj) {
					Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnLabel(i)).toString();
				} else {
					Arr[i - 1] = "null";
				}
			}
			newDataset.addRow(Arr);
		}
	} catch (e) {
		log.error("ERRO==============> consultarBanco " + e.message);
	} finally {
		if (rs != null) {
			rs.close();
		}
		if (stmt != null) {
			stmt.close();
		}
		if (conn != null) {
			conn.close();
		}
	}
	return newDataset;
}


/*
 * Função construtora para centralizar os serviços do Fluig
 *
 * É necessário cadastrar o serviço ECMCardService no ambiente fluig
 * Codigo: ECMCardService
 * Descrição: Webservice responsável por realizar operações como criar, alterar, excluir e pesquisar formulários
 * URL: http://<SERVER>:<PORT>/webdesk/ECMCardService?wsdl
 * 
 * É necessário cadastrar o serviço ECMDocumentService no ambiente fluig
 * Codigo: ECMDocumentService
 * Descrição: Webservice responsável por criar, atualizar, excluir e pesquisar documentos
 * URL: http://<SERVER>:<PORT>/webdesk/ECMDocumentService?wsdl
 *
 * @return {object}
 * @author Sérgio Machado
 */
function getWebServiceFluig() {
    var login = 'sergio.machado';
    var matricula = 'sergio.machado';
    var senha = '123456';

    this.getLogin = function() {
        return login;
    };
    
    this.getMatricula = function() {
        return matricula;
    };
    
    this.getSenha = function() {
        return senha;
    };
    
	this.getCardService = function() {
		try {
			// Determina serviço que será utilizado 
			var service = ServiceManager.getService('ECMCardService');
			// Inicializa serviço 
			var serviceHelper = service.getBean();
			// Instancia classe do serviço                              
			var serviceService = serviceHelper.instantiate('com.totvs.technology.ecm.dm.ws.ECMCardServiceService');
			// Obtem porta de serviço para chamar métodos do serviço
			var servicePort = serviceService.getCardServicePort();
			return {
				helper: serviceHelper,
				port: servicePort,
			};
		} catch (ex) {
			log.error("Houve um erro ao executar o método getCardService da função getWebServiceFluig")
			log.error(ex)
			throw ex;
		}
	},
	
	this.getDocumentService = function() {
		try {
			// Determina serviço que será utilizado 
			var service = ServiceManager.getService('ECMDocumentService');
			// Inicializa serviço 
			var serviceHelper = service.getBean();
			// Instancia classe do serviço                              
			var serviceService = serviceHelper.instantiate('com.totvs.technology.ecm.dm.ws.ECMDocumentServiceService');
			// Obtem porta de serviço para chamar métodos do serviço
			var servicePort = serviceService.getDocumentServicePort();
			return {
				helper: serviceHelper,
				port: servicePort,
			};
		} catch (ex) {
			log.error("Houve um erro ao executar o método getDocumentService da função getWebServiceFluig")
			log.error(ex)
			throw ex;
		}
	}
}