# Widget com CRUD completo com tabelas Pai e Filho

Este projeto aborda a criação de um crud completo com tabelas pai e filho dentro de uma widget para a plataforma [Fluig](https://www.totvs.com/fluig/).

## Visão Geral

A widget que criei permite a criação, leitura, atualização e exclusão (CRUD) de registros dentro de uma interface fluída e intuitiva. Além disso, o projeto aborda o conceito de tabelas pai e filho, proporcionando a capacidade de adicionar, atualizar e excluir linhas de registros relacionados.

A solução visa melhorar a experiência do usuário ao simplificar o pré-cadastro e tornar as operações mais eficientes. Ao utilizar esta widget, os usuários poderão realizar todas as operações CRUD de forma direta e fácil.

## Bibliotecas Utilizadas

A widget utiliza as seguintes bibliotecas:

- [Toastr](https://github.com/CodeSeven/toastr): Biblioteca para exibir notificações de alerta.
- [SweetAlert2](https://sweetalert2.github.io/): Biblioteca para criar modais de alerta personalizados.
- [PDFMAKE](https://pdfmake.github.io/docs/): Biblioteca para gerar arquivos PDF dinamicamente.
- [jQuery Validation Plugin](https://jqueryvalidation.org/): Biblioteca para validar formulários utilizando jQuery.
- [jQuery Mask Plugin](https://igorescobar.github.io/jQuery-Mask-Plugin/): Biblioteca para aplicar máscaras em campos de formulário.
- [DataTables plug-in for jQuery](https://datatables.net/): Biblioteca para criação e manipulação de tabelas interativas.


## Recursos e Aprendizados
Ao explorar este projeto, você encontrará os seguintes recursos e tópicos de aprendizado:

- Construção de um dataset avançado;
- Tratamento de erros no lado do back-end e do front-end;
- Execução de dataset via API REST;
- Consumo de serviço SOAP;
- Utilização do SDK do Fluig para atualização de registros em formulários;
- Modularização da widget em vários arquivos JS sem perder o escopo principal;
- Utilização de Promises, API Fetch e async/await dentro da widget;
- Retorno de um objeto único contendo os dados do formulário principal e dos dados das tabelas dinâmicas;
- Renderização de dados com Mustache;
- Separação da widget em vários templates FTL;
- Importação de bibliotecas externas na widget;
- Filtragem de registros de um formulário com base em um intervalo de datas;
- Geração de relatório com PDFMake.

## Instalação
1. Faça o download deste repositório para o seu ambiente local.
2. Importe o projeto no Eclipse ou Visual Studio Code, dependendo da sua preferência de ambiente de desenvolvimento.
3. Exporte o formulário form_cadastroPessoas01 para o servidor, seguindo as orientações da documentação [Exportando formulários](https://tdn.totvs.com/pages/releaseview.action?pageId=239018344#samples-3).
4. Exporte o dataset avançado *crud_cadastroPessoas01* para o servidor. Ao fazer isso, preste atenção nos seguintes tópicos:

   1. Verifique se o valor da variável **datasetForm** no dataset corresponde exatamente ao código do dataset exportado no item 3.

   2. No final do dataset, há uma função construtora chamada **getWebServiceFluig**. Informe as credenciais de acesso de um usuário do seu ambiente.

   3. Verifique se os serviços SOAP 'ECMCardService' e 'ECMDocumentService' estão cadastrados no seu ambiente. Se estiverem cadastrados com um código diferente, altere os métodos **getCardService** e **getDocumentService**.

5. Exporte sua Widget para o servidor Fluig. Antes de fazer a exportação, verifique se a propriedade 'datasetCrud' no arquivo JS principal da widget contém o valor do código do dataset avançado exportado no item 4

6. Após exportar a widget, crie uma nova página seguindo as orientações da documentação [Criar página](https://tdn.totvs.com/pages/releaseview.action?pageId=234455933). Adicione a widget em algum slot do layout e publique a página.


## Capturas de Tela

A seguir, estão algumas capturas de tela da widget em diferentes etapas do CRUD:

*Figura 1: Tela de listagem dos registros.*
![Tela de Listagem dos Registros](https://github.com/sergiomachadosilva/wgtCadastroPessoas/blob/master/forms/form_cadastroPessoas01/listagem_registros.png)

*Figura 2: Tela de criação de um novo registro.*
![Tela de Criação de um novo Registro](https://github.com/sergiomachadosilva/wgtCadastroPessoas/blob/master/forms/form_cadastroPessoas01/modal_criacao_registro.png)

![Tela de Visualização de um Registro Específico](https://github.com/sergiomachadosilva/wgtCadastroPessoas/blob/master/forms/form_cadastroPessoas01/modal_visualizacao_registro.png)

*Figura 3: Tela de visualização de um registro específico.*

*Figura 4: Tela de edição de um registro específico.*
![Tela de Edição de um Registro Específico](https://github.com/sergiomachadosilva/wgtCadastroPessoas/blob/master/forms/form_cadastroPessoas01/modal_edicao_registro.png)


## Contribuições

Sinta-se à vontade para explorar, aprimorar e contribuir com este projeto. Caso tenha sugestões, correções ou novos recursos a adicionar, entre em contato comigo através do LinkedIn:

[Sérgio Machado](https://www.linkedin.com/in/sergio-machado-analista-fluig)