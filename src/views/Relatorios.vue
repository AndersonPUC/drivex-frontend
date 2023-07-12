<template>
	<div>
		<v-card>
			<v-card-title>
				<v-icon left color="primary">mdi-file-chart</v-icon>Relatórios
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-text-field v-model="search" append-icon="search" label="Pesquisar relatório" single-line
							hide-details></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="12" md="12">
						<v-data-table :headers="headers" :items="relatorios" :server-items-length="4" class="elevation-1"
							:footer-props="{ itemsPerPageText: 'Itens por página:', pageText: '{0}-{1} de {2}', 'items-per-page-options': [5, 10, 15, 30, 60, 100] }"
							:loading="loading" dense>
							<template v-slot:[`item.excel`]="{ item }">
								<v-icon color="success" @click="exportExcel(item)">mdi-microsoft-excel</v-icon>
							</template>
							<template v-slot:[`item.csv`]="{ item }">
								<v-icon @click="exportCSV(item)">mdi-file-delimited</v-icon>
							</template>
							<template v-slot:[`item.pdf`]="{ item }">
								<v-icon color="error" @click="exportPDF(item)">mdi-file-pdf-box</v-icon>
							</template>
						</v-data-table>

					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>

export default {
	data: function () {
		return {
			headers: [
				{ text: 'Nome do relatório', value: 'nome' },
				{ text: 'Exportar excel', value: 'excel', align: 'center' },
				{ text: 'Exportar CSV', value: 'csv', align: 'center' },
				{ text: 'Exportar PDF', value: 'pdf', align: 'center' },
			],
			relatorios: [
				{
					id: 1,
					nome: 'Relatório de locação',
					role: ['*'],
				},
				{
					id: 2,
					nome: 'Relatório de seguradoras',
					role: ['rental_role', 'admin_role']
				},
				{
					id: 3,
					nome: 'Relatório de veiculos',
					role: ['rental_role', 'admin_role']
				},
				{
					id: 4,
					nome: 'Relatório de clientes',
					role: ['insurance_role', 'admin_role']
				}
			],

			loading: false,
			search: '',
			total: 0,
			dialog: false,
			inativo: false,
		}
	},
	methods: {
		exportExcel(item) {
			console.log(item.id)
		},
		exportCSV(item) {
			console.log(item.id)
		},
		exportPDF(item) {
			console.log(item.id)
		}
	},
}
</script>