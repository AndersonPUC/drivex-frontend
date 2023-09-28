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
								<v-icon color="success" @click="exportRelatorio(item)">mdi-file-export</v-icon>
							</template>
						</v-data-table>

					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<v-dialog v-model="rel_dialog" activator="parent" width="500">
			<v-card :loading="loading">
				<v-card-title>Download de relatório</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<h3>Escolha a forma de download</h3>
				</v-card-text>
				<v-card-actions>
					<downloadexcel class="v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default primary"
						:data="JSON.parse(JSON.stringify(relExcel))" :fields="fieldsExcel" worksheet="relatorio"
						name="relatorio.xls">
						EXCEL
					</downloadexcel>

					<downloadexcel class="v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default primary"
						:data="JSON.parse(JSON.stringify(relExcel))" :fields="fieldsExcel" worksheet="relatorio"
						name="relatorio.csv" type="csv">
						CSV
					</downloadexcel>
					
					<v-btn color="primary" disabled>PDF</v-btn>
					<v-btn color="primary" @click="rel_dialog = false">Fechar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>

import downloadexcel from "vue-json-excel";

export default {
	components: {
		downloadexcel,
	},
	data: function () {
		return {
			rel_dialog: false,
			headers: [
				{ text: 'Nome do relatório', value: 'nome' },
				{ text: 'Exportar relatório', value: 'excel', align: 'center' }
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
				// {
				// 	id: 4,
				// 	nome: 'Relatório de clientes',
				// 	role: ['insurance_role', 'admin_role']
				// }
			],
			loading: false,
			search: '',
			total: 0,
			dialog: false,
			inativo: false,
			relExcel: [],
			fieldsExcel: {},
			selected_rel: 0
		}
	},
	methods: {
		async exportRelatorio(item) {
			this.loading = true
			this.rel_dialog = true
			this.selected_rel = item.id
			await this.setData()
			this.loading = false
		},
		async getClientes() {
			const c = await this.axios.get('/clientes?limit=1000')
			return c.data.clientes
		},
		async getSeguradoras() {
			const c = await this.axios.get('/seguradoras?limit=1000')
			return c.data.seguradoras
		},
		async getVeiculos() {
			const c = await this.axios.get('/veiculos?limit=1000')
			return c.data.veiculos
		},
		async setData() {
			console.log(this.selected_rel)
			if (this.selected_rel == 1) {

				this.relExcel = await this.getClientes()
				this.fieldsExcel = {
					"ID": "id",
					"NOME": "nome",
					"SOBRENOME": "sobrenome",
					"EMAIL": "email",
					"CPF": "cpf",
					"CNH": "cnh",
					"TELEFONE": "telefone",
					"CELULAR": "celular",
					"DT NASCIMENTO": "dt_nascimento",
					"ATIVO": "ativo",
					"CNH": "tipo_cnh",
					"CRIADO EM": "createdAt",
					"ALTERADO EM": "updatedAt",
				}
			} else if (this.selected_rel == 2) {

				this.relExcel = await this.getSeguradoras()
				this.fieldsExcel = {
					"ID": "id",
					"CNPJ": "cnpj",
					"NOME SOCIAL": "nome_social",
					"NOME FANTASIA": "nome_fantasia",
					"EMAIL": "email",
					"ATIVO": "ativo",
					"CRIADO EM": "createdAt",
					"ALTERADO EM": "updatedAt",
				}
			} else if (this.selected_rel == 3) {

				this.relExcel = await this.getVeiculos()
				this.fieldsExcel = {
					"ID": "id",
					"MARCA": "marca",
					"MODELO": "modelo",
					"ANO FABRICACAO": "ano_fabricacao",
					"ANO MODELO": "ano_modelo",
					"COR": "cor",
					"PLACA": "placa",
					"RENAVAM": "renavam",
					"ATIVO": "ativo",
					"CRIADO EM": "createdAt",
					"ALTERADO EM": "updatedAt",
				}
			}


		}
	},
}
</script>


