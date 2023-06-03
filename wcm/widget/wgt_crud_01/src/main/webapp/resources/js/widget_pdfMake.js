/**
  * Gera PDF com o PDFMake
  * @param {object[]} dados Parâmetro obrigatório, lista de dados para geração do PDF
  * @return {void}
  * @author Sérgio Machado
  */	
MyWidget.pdfMake.generatePDF = function(dados) {
	try{
        const usuarioNome = this.currentUser.fullName;
        const dataCorrente = moment().format('DD/MM/YYYY [às] HH:mm');
        const tableBody = dados.map((obj, index) => [
			{text: (index +1), alignment: 'center', bold: true}, 
			{text: obj.documentId}, 
			{text: obj.dataCriacao, noWrap: true}, 
			{text: obj.nome}, 
			{text: obj.profissao},
			{text: obj.dataNascimento},
			{text: obj.atividadeRemuneradaText}
		]).map((row, index) => {
	        row.forEach(cell => {
	            cell.margin = [5, 5, 5, 5];
	            cell.fontSize = 9;
		        if (index % 2 === 0) { 
			    	cell.fillColor = '#f4f4f4';
			    }
	        });
		    return row;
		});

		const  docDefinition = {
		styles: {
	    	pageTitle: {
	      		fontSize: 22,
	      		bold: true,
	      		alignment: 'center',
	      		color: '#f7734e',
	      		margin: [0, 0, 0, 5]
	    	},
	    	pageSubTitle: {
	      		fontSize: 9,
	      		alignment: 'center',
	      		color: '#333',
	      		margin: [0, 0, 0, 30]
	    	},
	    	tableHeader:{
				fillColor: '#2ac4c0',
				color: '#fff',
				margin: [5, 5, 5, 5],
				bold: true,
				fontSize: 11,
			}
  		},
        content: [
            { text: 'Dados do Relatório', style: 'pageTitle' },
            { text: `Emitido por: ${usuarioNome} em ${dataCorrente}`, style: 'pageSubTitle' },
            {
                table: {
					headerRows: 1,
                    widths: ['auto', 'auto', 'auto', '*', '*', '*', '*'],
                    body: [
                        [
							{ text: '#', style: 'tableHeader', alignment: 'center'},
							{ text: 'ID', style: 'tableHeader'},
				            { text: 'Data Criação', style: 'tableHeader'},
							{ text: 'Nome', style: 'tableHeader'},
							{ text: 'Profissão', style: 'tableHeader'},
							{ text: 'Nascimento', style: 'tableHeader'},
							{ text: 'Empregado', style: 'tableHeader'}
                        ],
                        ...tableBody
                    ],
                },
                layout: 'noBorders'
            }
        ],
        footer: function (currentPage, pageCount) {
            return [
                {
                    text: ' Página ' + currentPage.toString() + ' de ' + pageCount,
                    alignment: 'center',
                    color: '#666',
                    fontSize: 10,
                },
            ]
        },
        pageSize: 'A4',
        pageMargins: [36, 36, 36, 50],
        pageOrientation: 'portrait',
    };

   	//pdfMake.createPdf(docDefinition).download('relatorio.pdf');
    pdfMake.createPdf(docDefinition).open();
    
	}catch (ex) {
		console.error(ex)
		Swal.fire(
            'Erro!',
            `Erro ao gerar o PDF: <br /><b style='color:#fa5353;'>${ex}</b>`,
            'error'
        )
	}	
}.bind(MyWidget);