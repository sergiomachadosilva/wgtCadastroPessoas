<!-- Modelo Mustache para o modal de visualização-->
<script id="tpl_formModalView" type="text/template">
	<fieldset>
		<legend>Dados</legend>
		<div class="row">
			<div class="col-md-2">
				<div class="form-group">
					<label class="control-label fs-display-block">Nome</label> 
					<span>{{nome}}</span>
				</div>
			</div>
			<div class="col-md-2">
		    	<div class="form-group">
					<label class="control-label fs-display-block">Profissão</label>
					<span>{{profissao}}</span>
				</div>
			</div>
			<div class="col-md-2">
		    	<div class="form-group">
					<label class="control-label fs-display-block">Nascimento</label>
					<span>{{dataNascimento}}</span>
				</div>
			</div>
			<div class="col-md-3">
		    	<div class="form-group">
					<label class="control-label fs-display-block">Exerce Atividade Remunerada?</label>
					<span>{{atividadeRemuneradaText}}</span>
				</div>
			</div>
		</div>
	</fieldset>
	
		{{#dependentes.length}}
	<fieldset>
		<legend>Dependentes</legend>	
		<div class="row">
			<div class="col-md-12">
				<table class="table table-striped table-hover">
	                <thead>
	                    <tr>
	                        <th class="text-center" style="width: 1%;">#</th>
	                        <th>Nome</th>
	                        <th>Matrícula</th>
	                        <th>Login</th>
	                        <th>E-mail</th>
	                    </tr>
	                </thead>
	                <tbody>
	                {{#dependentes}}
	                    <tr>
	                        <td class="fs-v-align-middle text-center fs-font-bold count" style="width: 1%;">
	                        	{{indice}}
	                        </td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{nome}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{matricula}}
		                        </div>
	                        </td>
	                         <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{login}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{email}}
		                        </div>
	                        </td>
	                    </tr>
	                    {{/dependentes}}
	                </tbody>
	            </table>
			</div>
		</div>
	</fieldset>
	{{/dependentes.length}}
	
	{{#enderecos.length}}
	<fieldset>
		<legend>Endereços</legend>	
		<div class="row">
			<div class="col-md-12">
				<table class="table table-striped table-hover">
	                <thead>
	                    <tr>
	                        <th class="text-center" style="width: 1%;">#</th>
	                        <th>CEP</th>
	                        <th>Endereço</th>
	                        <th>Número</th>
	                        <th>Bairro</th>
	                        <th>Cidade</th>
	                        <th>Estado</th>
	                    </tr>
	                </thead>
	                <tbody>
	                {{#enderecos}}
	                    <tr>
	                        <td class="fs-v-align-middle text-center fs-font-bold count" style="width: 1%;">
	                        	{{indice}}
	                        </td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{cep}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{endereco}}
		                        </div>
	                        </td>
	                         <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{numero}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{bairro}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{cidade}}
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            {{estado}}
		                        </div>
	                        </td>
	                    </tr>
	                    {{/enderecos}}
	                </tbody>
	            </table>
			</div>
		</div>
	</fieldset>
	{{/enderecos.length}}
	
	<div class="row">
		<div class="col-md-4">
			<fieldset>
				<legend>Criação</legend>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label class="control-label fs-display-block">Usuário</label> 
							<span>{{usuarioCriacao}}</span>
						</div>
					</div>
					<div class="col-md-6">
				    	<div class="form-group">
							<label class="control-label fs-display-block">Data</label>
							<span>{{dataCriacao}}</span>
						</div>
					</div>
				</div>
			</fieldset>
		</div>
		{{#alterado}}
		<div class="col-md-4">
			<fieldset>
				<legend>Alteração</legend>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label class="control-label fs-display-block">Usuário</label> 
							<span>{{usuarioAtualizacao}}</span>
						</div>
					</div>
					<div class="col-md-6">
				    	<div class="form-group">
							<label class="control-label fs-display-block">Data</label>
							<span>{{dataAtualizacao}}</span>
						</div>
					</div>
				</div>
			</fieldset>
		</div>
		{{/alterado}}
	</div>
</script>