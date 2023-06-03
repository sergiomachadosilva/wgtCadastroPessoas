<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	
    <div class="panel panel-custom">
        <div class="panel-heading">
        	<div class="row">
        		<div class="col-md-12">
		        	<div class="fs-display-flex fs-justify-content-space-between fs-sm-margin-bottom">
		                <h3 class="panel-title fs-xs-margin-top">Filtro</h3>
		                <div class="heading-elements">
		                    <ul class="list-inline fs-no-margin-bottom">
		                        <li>
		                            <button title="Maximizar" data-maximizar="">
		                            <i class="flaticon flaticon-maximize icon-sm" aria-hidden="true"></i>
		                            </button>
		                        </li>
		                    </ul>
		                </div>
		            </div>
        		</div>
        	</div>
            
            <div class="row">
                <div class="col-md-2">
                    <div class="form-group">
                        <label class="control-label">Data De:</label> 
                        <div class="input-group">
                            <span class="input-group-addon">
                            <i class="fluigicon fluigicon-calendar"></i>
                            </span>
                            <input type="text" class="form-control" id="dataCadastroDe" />
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="form-group">
                        <label class="control-label">Data Até:</label> 
                        <div class="input-group">
                            <span class="input-group-addon">
                            <i class="fluigicon fluigicon-calendar"></i>
                            </span>
                            <input type="text" class="form-control" id="dataCadastroAte" />
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <buttom class="btn btn-success" data-buscar=""  style="margin-top: 25px" title="Buscar Dados">
                        <i class="flaticon flaticon-search icon-sm" aria-hidden="true"></i> Buscar Dados
                    </buttom>
                </div>
            </div>
        </div>
        <div class="panel-body collapse fs-lg-padding-top in">
			<div class="row">
				<div class="col-md-12">
					<div class="fs-full-width fs-sm-margin-bottom table-responsive">
						<table id="tabela" class="table table-striped table-bordered" style="width:100%">
				            <thead>
				                <tr>
									<th class="text-nowrap fs-v-align-middle" style="width:1%;">#</th>
									<th class="text-nowrap fs-v-align-middle" style="width:1%;">ID</th>
									<th class="text-nowrap fs-v-align-middle">Data Criação</th>
									<th class="text-nowrap fs-v-align-middle">Criado Por</th>
									<th class="text-nowrap fs-v-align-middle">Nome</th>
									<th class="text-nowrap fs-v-align-middle">Profissão</th>
									<th class="text-nowrap fs-v-align-middle">Nascimento</th>
									<th class="text-nowrap fs-v-align-middle">Empregado</th>
									<th class="text-nowrap fs-v-align-middle">Ações</th>
				                </tr>
				            </thead>
				        </table>
				    </div>
				</div>
			</div>
        </div>
    </div>
	
	
	<#include "tpl_formModalNew.ftl">
	<#include "tpl_formModalUpdate.ftl">
	<#include "tpl_formModalView.ftl">
	<#include "tpl_dataTableUsers.ftl">
	
</div>

