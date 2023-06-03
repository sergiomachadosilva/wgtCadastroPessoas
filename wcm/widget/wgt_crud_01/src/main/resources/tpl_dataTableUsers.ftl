<script type="text/template" class="messageDataTableUsers">
	<p class="fs-no-padding-bottom fs-font-bold">Selecione o Usuário desejado e clique no botão 'Inserir', para adicionar à lista.</p>
</script>

<!-- Modelo Mustache para renderização da lista de usuário dentro do dataTable -->
<script type="text/template" class="dataTableUsers">
	<tr>
		<td class="fs-v-align-middle text-center isSelected">
			<i class="flaticon flaticon-square icon-md" aria-hidden="true"></i>
			<i class="flaticon flaticon-square-check icon-md" aria-hidden="true"></i>
		</td>
		<td class="fs-v-align-middle text-nowrap text-center"><b>{{indice}}</b></td>
		<td class="fs-v-align-middle text-nowrap">{{nome}}</td>
		<td class="fs-v-align-middle text-nowrap">{{matricula}}</td>
		<td class="fs-v-align-middle text-nowrap">{{login}}</td>
		<td class="fs-v-align-middle text-nowrap">{{email}}</td>
		<td class="fs-v-align-middle text-nowrap">{{ativo}}</td>
		<td class="fs-v-align-middle text-nowrap">{{administrador}}</td>
	</tr>
</script>