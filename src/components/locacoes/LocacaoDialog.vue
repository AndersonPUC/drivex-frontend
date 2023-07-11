<template>
	<v-dialog v-model="locacaoDialog" max-width="1024">
		<v-form ref="form">
			<v-card>
				<v-card-title>
					<v-icon color="primary" left>mdi-home-city</v-icon>Nova locação: DRIVEX
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
						</template>
						<span>{{ idLocacao }}</span>
					</v-tooltip>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogClose">
						<v-icon color="primary">close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="1" md="1">
							<v-text-field label="ID" v-model="locacao.id" readonly></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-menu ref="dateMenuDtLocacao" v-model="dateMenuDtLocacao" :close-on-content-click="false"
								transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-model="dateFormattedDtLocacao" label="Dt. Locação"
										prepend-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										:rules="[rules.required]" />
								</template>
								<v-date-picker locale="pt-br" v-model="dateNFormattedDtLocacao" no-title
									@input="dateMenuDtLocacao = false"></v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-menu ref="dateMenuPrevEntrega" v-model="dateMenuPrevEntrega" :close-on-content-click="false"
								transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-model="dateFormattedPrevEntrega" label="Prev. Entrega"
										prepend-icon="mdi-calendar" v-bind="attrs" v-on="on" readonly
										:rules="[rules.required]" />
								</template>
								<v-date-picker locale="pt-br" v-model="dateNFormattedPrevEntrega" no-title
									@input="dateMenuPrevEntrega = false"></v-date-picker>
							</v-menu>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-checkbox v-model="locacao.lavagem_inclusa" label="Lavagem Inclusa"></v-checkbox>
						</v-col>
						<v-col cols="12" sm="4" md="4" v-if="this.locacao.dt_entrega">
							<v-row>
								<v-spacer />
								<v-card-title align-content="center">Dt.Entrega: {{formatDate(this.locacao.dt_entrega.slice(0, 10))}}</v-card-title>
							</v-row>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="10" md="10">
							<v-select label="Cliente" :items="clientes" item-text="nome" item-value="id" v-model="clienteId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-btn color="primary" text block><v-icon left>mdi-open-in-new</v-icon>Cliente</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="3" md="3">
							<v-select label="Categoria" :items="categorias" item-text="categoria" item-value="id"
								v-model="categoriaId" :rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-select label="Marca" :items="marcas" item-text="marca" item-value="id" v-model="marcaId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-select label="Modelo" :items="modelos" item-text="modelo" item-value="id" v-model="modeloId"
								:rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-btn color="primary" text block><v-icon left>mdi-open-in-new</v-icon>Veiculo</v-btn>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="2" md="2">
							<v-select label="Nivel Combustivel" :items="nivelcombustivel"
								v-model="locacao.nivel_combustivel" :rules="[rules.required]"></v-select>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="KM Inicial" v-model="locacao.km_inicial" v-mask="'#########'"
								:rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="KM Final" v-model="locacao.km_final"
								:disabled="locacaoId == '' ? true : false" v-mask="'#########'"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-text-field label="OBS" v-model="locacao.observacoes"
								:rules="[rules.required]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-btn color="success" @click="save()" v-if="!this.locacao.dt_entrega"><v-icon
									left>mdi-content-save</v-icon>Salvar</v-btn>
							<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"
								text><v-icon left>mdi-cancel</v-icon>Cancelar</v-btn>
							<v-btn color="error" @click="inativar()" style="margin-left: 3px; margin-right: 3px;"
								v-if="this.locacao.id && this.locacao.ativo && !this.locacao.dt_entrega"><v-icon
									left>mdi-delete</v-icon>Inativar</v-btn>
							<v-btn color="primary" @click="ativar()" style="margin-left: 3px; margin-right: 3px;"
								v-if="this.locacao.id && !this.locacao.ativo"><v-icon
									left>mdi-recycle</v-icon>Recuperar</v-btn>
							<v-btn color="info" v-if="!this.locacao.dt_entrega" @click="finalizar()"
								style="margin-left: 3px; margin-right: 3px;"><v-icon left>mdi-flag</v-icon>Finalizar</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

export default {
	props: {
		locacaoId: String,
		dialog: Boolean
	},
	data: function () {
		return {
			locacao: {},
			loading: false,
			dateMenuDtLocacao: false,
			dateNFormattedDtLocacao: '',
			dateFormattedDtLocacao: '',
			dateMenuPrevEntrega: false,
			dateNFormattedPrevEntrega: '',
			dateFormattedPrevEntrega: '',
			nivelCombustivelSelected: '4/4',
			clientes: [],
			categorias: [],
			marcas: [],
			modelos: [],
			nivelcombustivel: [
				'0',
				'1/4',
				'1/2',
				'3/4',
				'4/4',
			],
			clienteId: '',
			marcaId: '',
			modeloId: '',
			categoriaId: '',
			rules: {
				required: value => !!value || 'Informe um valor.',
				email: value => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return pattern.test(value) || 'E-mail invalido.'
				},
			},
		}
	},
	computed: {
		...mapGetters(['userAdmin']),
		...mapState(['user']),
		locacaoDialog: {
			get() {
				return this.dialog
			},
			set() {
				this.dialogClose()
			}
		},
		idLocacao() {
			if (!this.locacaoId) return "Novo"

			return this.locacaoId
		},
	},
	methods: {
		dialogClose() {
			this.$refs.form.resetValidation()
			this.nivelCombustivelSelected = '4/4'
			this.locacao = {}
			this.clienteId = ''
			this.marcaId = ''
			this.modeloId = ''
			this.categoriaId = ''
			this.dateNFormattedDtLocacao = ''
			this.dateFormattedDtLocacao = ''
			this.dateNFormattedPrevEntrega = ''
			this.dateFormattedPrevEntrega = ''
			this.$emit('dialogClose')
		},
		formatDate(date) {
			if (!date) return null

			const [year, month, day] = date.split('-')
			return `${day}/${month}/${year}`
		},
		async loadLocacoes() {
			try {
				if (this.locacaoId == "0" || !this.locacaoId) return

				this.loading = true
				const response = await this.axios.get(`/locacoes/${this.locacaoId}`)
				this.locacao = response.data
				this.clienteId = this.locacao.cliente.id
				this.marcaId = this.locacao.veiculo.marca
				this.modeloId = this.locacao.veiculo.id
				this.categoriaId = this.locacao.veiculo.categorium.id

			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadClientes() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/clientes`)
				this.clientes = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadCategorias() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/categorias`)
				this.categorias = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadMarcas() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/marcas/`, {
					params: { categoria: this.categoriaId }
				})
				this.marcas = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadModelos() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/modelos`, {
					params: { categoria: this.categoriaId, marca: this.marcaId }
				})
				this.modelos = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		getAllData() {
			this.loadClientes()
			this.loadCategorias()
		},

		///
		///
		///
		///
		///
		async save() {
			if (this.$refs.form.validate()) {
				if (!this.locacaoId)
					this.addLocacao()
				else
					this.alterarLocacao()
			}

		},
		async inativar() {
			this.setStatus(false)
		},
		async ativar() {
			this.setStatus(true)
		},
		async finalizar() {
			try {
				if (this.locacaoId == "0" || !this.locacaoId) return

				let req = {
					km_final: this.locacao.km_final
				}

				this.loading = true
				const response = await this.axios.put(`/locacoes/${this.locacaoId}/finalizar`, req)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Locação finalizada com sucesso.')
					this.dialogClose()
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async setStatus(status) {
			try {
				if (this.locacaoId == "0" || !this.locacaoId) return

				let req = {
					status: status
				}

				this.loading = true
				const response = await this.axios.put(`/locacoes/${this.locacaoId}/status`, req)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Locação alterado com sucesso.')
					this.dialogClose()
					//this.$emit('dialogClose')
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},


		async addLocacao() {
			try {
				let locacaoAdd = {
					dt_locacao: this.dateNFormattedDtLocacao,
					dt_previsao_entrega: this.dateNFormattedPrevEntrega,
					km_inicial: this.locacao.km_inicial,
					observacoes: this.locacao.observacoes,
					lavagem_inclusa: this.locacao.lavagem_inclusa ? this.locacao.lavagem_inclusa : false,
					nivel_combustivel: this.locacao.nivel_combustivel,
					veiculo_id: this.modeloId,
					cliente_id: this.clienteId,
					seguradora_id: 51
				}


				this.loading = true
				var response = await this.axios.post(`/locacoes`, locacaoAdd)

				if (response.status == 200) {
					var id = response.data.id
					this.$store.dispatch('showSuccess', 'Locacoes inserido com sucesso')
					this.dialogClose()
				} else {
					this.$store.dispatch('showError', response.data.msg)
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		// async alterarCliente() {
		// 	try {
		// 		let userAlter = {
		// 			nome: this.cliente.nome,
		// 			sobrenome: this.cliente.sobrenome,
		// 			email: this.cliente.email,
		// 			cpf: this.cliente.cpf,
		// 			cnh: this.cliente.cnh,
		// 			telefone: this.cliente.telefone,
		// 			celular: this.cliente.celular,
		// 			dt_nascimento: this.dateNFormatted ? this.dateNFormatted : this.cliente.dt_nascimento,
		// 			tipo_cnh: this.cliente.tipo_cnh,
		// 			municipioId: this.cidadeId
		// 		}

		// 		let enderecoAlter = {
		// 			logradouro: this.endereco.logradouro,
		// 			bairro: this.endereco.bairro,
		// 			cep: this.endereco.cep,
		// 			complemento: this.endereco.complemento,
		// 			municipioId: this.cidadeId
		// 		}

		// 		this.loading = true
		// 		var response = await this.axios.put(`/clientes/${this.cliente.id}`, userAlter)

		// 		if (response.status == 200) {
		// 			await this.axios.put(`/clientes/${this.cliente.id}/endereco/${this.endereco.id}`, enderecoAlter)
		// 			this.$store.dispatch('showSuccess', 'Cliente alterado com sucesso')
		// 			//this.$emit('dialogClose')
		// 			this.dialogClose()
		// 		} else {
		// 			this.$store.dispatch('showError', response.data.msg)
		// 		}
		// 	} catch (error) {
		// 		this.$store.dispatch('showError', error)
		// 	} finally {
		// 		this.loading = false
		// 	}
		// },
		///
		///
		///
		///
	},
	watch: {
		locacaoId() {
			this.getAllData()

			if (this.locacaoId)
				this.loadLocacoes()
		},
		dateNFormattedDtLocacao() {
			if (this.dateNFormattedDtLocacao)
				this.dateFormattedDtLocacao = this.formatDate(this.dateNFormattedDtLocacao)
		},
		dateNFormattedPrevEntrega() {
			if (this.dateNFormattedPrevEntrega)
				this.dateFormattedPrevEntrega = this.formatDate(this.dateNFormattedPrevEntrega)
		},
		categoriaId() {
			if (this.categoriaId)
				this.loadMarcas()
		},
		marcaId() {
			if (this.marcaId)
				this.loadModelos()
		},
		'locacao.dt_locacao'() {
			if (this.locacao.dt_locacao)
				this.dateFormattedDtLocacao = this.formatDate(this.locacao.dt_locacao.slice(0, 10))
		},
		'locacao.dt_previsao_entrega'() {
			if (this.locacao.dt_previsao_entrega)
				this.dateFormattedPrevEntrega = this.formatDate(this.locacao.dt_previsao_entrega.slice(0, 10))
		}
	},
	mounted() {
		this.getAllData()
	}
}
</script>
