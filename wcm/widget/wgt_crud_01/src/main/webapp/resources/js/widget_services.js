/**
 * Retorna dados do usuário corrente
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.geCurrentUser = function() {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/2.0/users/getCurrent', {
				method: 'GET',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao buscar dados do usuário');
			})
			.then((result) => {
				const dados = result.content;
				self.currentUser = dados;
			    resolve(dados);
			})
			.catch((ex) => {
				reject(ex)
			})

		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Retorna dados do usuário corrente
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getUsersFluig = function() {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			// Verifica se a lista de usuário já esta na memória
			if(self.listUsers && self.listUsers.length){
				//console.log('Lista de usuário já carregada, buscar da memória...')
		        setTimeout(function() {
		        	resolve(self.listUsers)
		        }, 100); 
			}else{
				//console.log('Lista de usuário não carregada, efetuar requisição...')
				fetch('/api/public/ecm/dataset/datasets', {
					method: 'POST',
					body: JSON.stringify({
						name: 'colleague',
						order: ['colleagueName']
					}),
					headers: {
						'Content-type': 'application/json; charset=UTF-8'
					}
				})
				.then((response) => {
					if (response.ok) {
						return response.clone().json();
					}
					throw ('Erro ao buscar dados do usuário');
				})
				.then((result) => {
					const usuarios = result.content.values;
					if(usuarios.length){
						const newArrayListUsers = usuarios.map((obj, index) => ({
							indice: index + 1,
							nome: obj['colleagueName'],
							matricula: obj['colleaguePK.colleagueId'],
							login: obj['login'],
							email: obj['mail'],
							ativo: obj['active'] == 'true' ? 'Sim' : 'Não', 
							administrador: obj['adminUser'] == 'true' ? 'Sim' : 'Não',					
						}));
						// Aguarda 5 segundos para retornar os dados
						//setTimeout(() => {
							self.listUsers = newArrayListUsers;
							resolve(newArrayListUsers)
						//}, 3000)
					}else{
						self.listUsers = newArrayListUsers;
						reject('Nenhum usuário foi encontrado')
					}
				})
				.catch((ex) => {
					self.listUsers = newArrayListUsers;
					reject(ex)
				})
			}

		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);



/**
 * Retorna lista de todos os registros
 * @param {object[]} constraints Parâmetro obrigatório, Lista de constraints
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getAll = function(constraints) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao obter a lista de registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						let newObject = dados.map((obj) =>{
							return {
								...obj,
								atividadeRemuneradaText: obj['atividadeRemunerada'] == 'on' ? 'Sim' : 'Não',
							};
						});
						resolve(newObject)
					}else{
						reject(dados[0].ERRO)
					}
				}else{
					resolve([])
				}
			})
			.catch((ex) => {
				reject(ex)
			})
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Retorna dados de um registro específico
 * @param {object[]} constraints Parâmetro obrigatório, Lista de constraints
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getByDocumentId = function(constraints) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao obter dado do registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						let newObject = dados.map((obj) =>{
							return {
								...obj,
								atividadeRemuneradaText: obj['atividadeRemunerada'] == 'on' ? 'Sim' : 'Não',
								atividadeRemuneradaBoolean: obj['atividadeRemunerada'] == 'on' ? true : false,
								alterado: obj['usuarioAtualizacao'] ? true : false,
							};
						});
						resolve(newObject[0])
					}else{
						reject(dados[0].ERRO)
					}
				}else{
					reject("Registro não encontrado")
				}
			})
			.catch((ex) => {
				reject(ex)
			})
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Retorna dados da tabela dinâmica de Endereços de um registro específico
 * @param {string | number} documentId Parâmetro obrigatório, Código do registro do formulário
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getAdressByDocumentId = function(documentId) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints:[
						self.utils.createConstraint('method', 'read'),
						self.utils.createConstraint('readingType', 'getAdressById'),
						self.utils.createConstraint('documentId', documentId),
					]
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao obter dado da tabela dinâmica do registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						let newArray = dados.map((obj, index) =>{
							return {
								indice: index + 1,
								...obj
							};
						});
						resolve(newArray)
					}else{
						reject(dados[0].ERRO)
					}
				}else{
					resolve([])
				}
			})
			.catch((ex) => {
				reject(ex)
			})
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);

/**
 * Retorna dados da tabela dinâmica de Dependentes de um registro específico
 * @param {string | number} documentId Parâmetro obrigatório, Código do registro do formulário
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getDependentsByDocumentId = function(documentId) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints:[
						self.utils.createConstraint('method', 'read'),
						self.utils.createConstraint('readingType', 'getDependentsById'),
						self.utils.createConstraint('documentId', documentId),
					]
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao obter dado da tabela dinâmica do registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						let newArray = dados.map((obj, index) =>{
							return {
								indice: index + 1,
								...obj
							};
						});
						resolve(newArray)
					}else{
						reject(dados[0].ERRO)
					}
				}else{
					resolve([])
				}
			})
			.catch((ex) => {
				reject(ex)
			})
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Cria um novo registro
 * @param {object[]} constraints Parâmetro obrigatório, Lista de constraints
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.create = function(constraints) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao salvar registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						resolve(dados[0].documentId);
					}else{
						reject(dados[0].ERRO)
					}
				}
			})
			.catch((ex) => {
				reject(ex)
			})

		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Atualiza um registro
 * @param {object[]} constraints Parâmetro obrigatório, Lista de constraints
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.update = function(constraints) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao atualizar o registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						resolve(dados[0].status);
					}else{
						reject(dados[0].ERRO)
					}
				}
			})
			.catch((ex) => {
				reject(ex)
			})

		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Exclui um registro de formulário e envia para a lixeira
 * @param {object[]} constraints Parâmetro obrigatório, lista de constraints
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.destroy = function(constraints) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch('/api/public/ecm/dataset/datasets', {
				method: 'POST',
				body: JSON.stringify({
					name: self.datasetCrud,
					constraints
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao excluir o registro');
			})
			.then((result) => {
				const dados = result.content.values;
				if(dados.length){
					if(!dados[0].ERRO){
						resolve(dados[0].status);
					}else{
						reject(dados[0].ERRO )
					}
				}
			})
			.catch((ex) => {
				reject(ex)
			})
		} catch (ex) {
			reject(ex)
		}
	})
}.bind(MyWidget);


/**
 * Consulta CEP
 * @param {string | number} cep Parâmetro obrigatório, Endereço postal a ser consultado
 * @return {Promise}
 * @author Sérgio Machado
 */
MyWidget.services.getAdressByCep = function(cep) {
	let self = this;
	return new Promise(function(resolve, reject) {
		try {
			fetch(`https://viacep.com.br/ws/${cep}/json`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			})
			.then((response) => {
				if (response.ok) {
					return response.clone().json();
				}
				throw ('Erro ao obterdado do CEP');
			})
			.then((result) => {
				setTimeout(() => {
					if (!result.erro){
						resolve(result)
					}else{
						reject('CEP não encontrado')
					}
				}, 500);				
			})
			.catch((ex) => {
				console.log(ex)
				reject(ex)
			})
		} catch (ex) {
			console.log(ex)
			reject(ex)
		}
	})
}.bind(MyWidget);