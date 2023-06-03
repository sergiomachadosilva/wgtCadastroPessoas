<!-- Modelo Mustache para o modal de atualização-->
<script id="tpl_formModalUpdate" type="text/template">
	<fieldset>
		<legend>Dados</legend>
		<div class="row">
			<div class="col-md-3">
				<div class="form-group">
					<label class="control-label" for="nome">Nome</label> 
					<input type="text" class="form-control" name="nome" id="nome" value="{{nome}}" />
				</div>
			</div>
			<div class="col-md-3">
		    	<div class="form-group">
					<label class="control-label" for="profissao">Profissão</label>
					<input type="text" class="form-control" name="profissao" id="profissao" value="{{profissao}}" />
				</div>
			</div>
			<div class="col-md-2">
				<div class="form-group">
					<label class="control-label" for="dataNascimento">Nascimento</label> 
					<div class="input-group">
						<span class="input-group-addon">
				            <i class="fluigicon fluigicon-calendar"></i>
				        </span>
						<input type="text" class="form-control" name="dataNascimento" id="dataNascimento" value="{{dataNascimento}}"/>
					</div>
				</div>
			</div>
			<div class="col-md-3">
				<div class="form-group fs-lg-margin-top">
					<label class="control-label">Exerce Atividade Remunerada?</label> 
					<input type="hidden" name="atividadeRemunerada" id="atividadeRemunerada" value="{{atividadeRemunerada}}" />
					<input type="checkbox" {{#atividadeRemuneradaBoolean}}checked="checked"{{/atividadeRemuneradaBoolean}} id="atividadeRemuneradaOpt" data-size="small" data-on-color="success" data-off-color="danger" data-on-text="Sim" data-off-text="Não">
				</div>
			</div>
		</div>
	</fieldset>
	
	<fieldset>
		<legend>Dependentes</legend>	
		<div class="row">
			<div class="col-md-12">
				<table class="table" id="tableDependentes">
	                <thead>
	                    <tr>
	                        <th class="text-center" style="width: 1%;">#</th>
	                        <th>Nome</th>
	                        <th>Matrícula</th>
	                        <th>Login</th>
	                        <th>E-mail</th>
	                        <th class="text-center">Excluir</th>
	                    </tr>
	                </thead>
	                <tbody>
	                    <tr style="display:none">
	                        <td class="fs-v-align-middle text-center fs-font-bold count" style="width: 1%;"></td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
				                    <div class="input-group input-group-custom">
										<input type="text" class="form-control input-sm" name="dependenteNome"  placeholder="Selecione..."  readonly="readonly"/>
										<div class="input-group-addon search fs-cursor-pointer" title="Pesquisar" data-openModalUsers="">
											<i class="flaticon flaticon-search"></i>
										</div>
										<div class="input-group-addon trash fs-cursor-pointer" title="Excluir" data-setEmptyRowDep="">
											<i class="flaticon flaticon-trash"></i>
										</div>
									</div>
		                        </div>
	                        </td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="dependenteMatricula" readonly="readonly"/>
		                        </div>
	                        </td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="dependenteLogin" readonly="readonly"/>
		                        </div>
	                        </td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="dependenteEmail" readonly="readonly"/>
		                        </div>
	                        </td>

	                   		<td class="fs-v-align-middle fs-text-center" style="width: 1%;">
	                   			<div class="btnLixeira">
									<i class="fluigicon fluigicon-trash icon-md fs-xs-padding fs-cursor-pointer fs-color-danger" title="Remover" data-removeRowDep=""></i>
								</div>	
							</td>
	                    </tr>
	                </tbody>
	            </table>
			    <button type="button" class="btn btn-sm btn-success fs-xs-margin-bottom btn-addRow" data-addRowDep="" title="Adicionar Novo Dependente">
			    <i class="flaticon flaticon-add-plus" aria-hidden="true"></i> Novo Dependente</button>
			</div>
		</div>
	</fieldset>
		
	<fieldset>
		<legend>Endereços</legend>
		<div class="row">
			<div class="col-md-12">
				<table class="table" id="tableEnderecos">
	                <thead>
	                    <tr>
	                        <th class="text-center" style="width: 1%;">#</th>
	                        <th>CEP</th>
	                        <th>Endereço</th>
	                        <th>Número</th>
	                        <th>Bairro</th>
	                        <th>Cidade</th>
	                        <th>Estado</th>
	                        <th class="text-center">Excluir</th>
	                    </tr>
	                </thead>
	                <tbody>
	                    <tr style="display:none">
	                        <td class="fs-v-align-middle text-center fs-font-bold count" style="width: 1%;"></td>
	                        <td class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="cep" />
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="endereco" />
		                        </div>
	                        </td>
	                         <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="numero" />
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="bairro" />
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <input type="text" class="form-control input-sm" name="cidade" readonly="readonly"/>
		                        </div>
	                        </td>
	                        <td  class="fs-v-align-middle">
		                        <div class="form-group fs-no-margin-bottom">
		                            <select class="form-control input-sm" name="estado" readonly="readonly" style="pointer-events: none">
		                            	<option value="" selected="selected"></option>
										<option value="AC">Acre</option>
										<option value="AL">Alagoas</option>
										<option value="AP">Amapá</option>
										<option value="AM">Amazonas</option>
										<option value="BA">Bahia</option>
										<option value="CE">Ceará</option>
										<option value="DF">Distrito Federal</option>
										<option value="ES">Espírito Santo</option>
										<option value="GO">Goiás</option>
										<option value="MA">Maranhão</option>
										<option value="MT">Mato Grosso</option>
										<option value="MS">Mato Grosso do Sul</option>
										<option value="MG">Minas Gerais</option>
										<option value="PA">Pará</option>
										<option value="PB">Paraíba</option>
										<option value="PR">Paraná</option>
										<option value="PE">Pernambuco</option>
										<option value="PI">Piauí</option>
										<option value="RJ">Rio de Janeiro</option>
										<option value="RN">Rio Grande do Norte</option>
										<option value="RS">Rio Grande do Sul</option>
										<option value="RO">Rondônia</option>
										<option value="RR">Roraima</option>
										<option value="SC">Santa Catarina</option>
										<option value="SP">São Paulo</option>
										<option value="SE">Sergipe</option>
										<option value="TO">Tocantins</option>
									</select>
		                        </div>
	                        </td>
	                   		<td class="fs-v-align-middle fs-text-center" style="width: 1%;">
	                   			<div class="btnLixeira">
									<i class="fluigicon fluigicon-trash icon-md fs-xs-padding fs-cursor-pointer fs-color-danger" title="Remover" data-removeRowEnd=""></i>
								</div>	
							</td>
	                    </tr>
	                </tbody>
	            </table>
			    <button type="button" class="btn btn-sm fs-xs-margin-bottom btn-success" data-addRowEnd="" title="Adicionar Novo Endereço">
			    <i class="flaticon flaticon-add-plus" aria-hidden="true"></i> Novo Endereço</button>
			</div>
		</div>
	</fieldset>
</script>