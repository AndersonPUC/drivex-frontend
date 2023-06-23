<template>
	<v-dialog v-model="clienteDialog" max-width="1024">
		<v-form>
			<v-card>
				<v-card-title>
					<v-icon color="primary" left>person</v-icon>Cadastro de Cliente
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
						</template>
						<span>{{ idCliente }}</span>
					</v-tooltip>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogClose">
						<v-icon color="primary">close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="ID" readonly v-model="cliente.id"></v-text-field>
						</v-col>
						<v-col cols="12" sm="5" md="5">
							<v-text-field label="Nome" v-model="cliente.nome"></v-text-field>
						</v-col>
						<v-col cols="12" sm="5" md="5">
							<v-text-field label="Sobrenome" v-model="cliente.sobrenome"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="4" md="4">
							<v-text-field label="CPF" v-model="cliente.cpf"></v-text-field>
						</v-col>
						<v-col cols="12" sm="5" md="5">
							<v-text-field label="CNH" v-model="cliente.cnh"></v-text-field>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-select label="Tipo CNH" :items="['A', 'B', 'AB']" v-model="cliente.tipo_cnh"></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="4" md="4">
							<v-text-field label="Celular" v-model="cliente.celular"></v-text-field>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-text-field label="Telefone" v-model="cliente.telefone"></v-text-field>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-menu ref="dateMenu" v-model="dateMenu" :close-on-content-click="false"
								transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-model="dateFormatted" label="Dt. Nascto" prepend-icon="mdi-calendar"
										v-bind="attrs" v-on="on" readonly />
								</template>
								<v-date-picker locale="pt-br" v-model="dateNFormatted" no-title
									@input="dateMenu = false"></v-date-picker>
							</v-menu>
							<!-- <v-text-field label="Dt. Nascto" v-model="cliente.dt_nascimento"></v-text-field> -->
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-text-field label="Email" v-model="cliente.email"
								:rules="[rules.required, rules.email]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-tabs v-model="tab" grow optional>
								<v-tab>
									<v-icon left>mdi-map-marker</v-icon>Endereço
								</v-tab>
								<v-tabs-items v-model="tab">
									<v-tab-item key="enderecoTab">
										<v-row>
											<v-col cols="12" sm="12" md="12">
												<v-text-field label="Logradouro"
													v-model="endereco.logradouro"></v-text-field>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" sm="3" md="3">
												<v-text-field label="Bairro" v-model="endereco.bairro"></v-text-field>
											</v-col>
											<v-col cols="12" sm="3" md="3">
												<v-text-field label="CEP" v-model="endereco.cep"></v-text-field>
											</v-col>
											<v-col cols="12" sm="3" md="3">
												<v-select label="Estado" :items="estados" item-text="estado" item-value="id"
													v-model="estadoId"></v-select>
											</v-col>
											<v-col cols="12" sm="3" md="3">
												<v-select label="Cidade" :items="cidades" item-text="municipio"
													item-value="id" v-model="cidadeId"></v-select>
											</v-col>
										</v-row>
										<v-row>
											<v-col cols="12" sm="12" md="12">
												<v-text-field label="Complemento"
													v-model="endereco.complemento"></v-text-field>
											</v-col>
										</v-row>
									</v-tab-item>
								</v-tabs-items>
							</v-tabs>
						</v-col>
					</v-row>
					<v-row>
						<v-btn color="success" @click="save()"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
						<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"><v-icon
								left>mdi-cancel</v-icon>Cancelar</v-btn>
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
		clienteId: String,
		dialog: Boolean
	},
	data: function () {
		return {
			cliente: {},
			loading: false,
			tab: null,
			endereco: {},
			estados: [],
			cidades: [],
			estadoId: "",
			cidadeId: "",
			dateFormatted: "",
			dateNFormatted: "",
			dateMenu: false,
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
		clienteDialog: {
			get() {
				return this.dialog
			},
			set() {
				this.dialogClose()
			}
		},
		idCliente() {
			if (!this.clienteId) return "Novo"

			return this.clienteId
		}
	},
	methods: {
		dialogClose() {
			this.tab = null
			this.cliente = {}
			this.$emit('dialogClose')
		},
		enderecoOpen() {
			this.dialog_endereco = true
		},
		async loadClientes() {
			try {
				if (this.clienteId == "0" || !this.clienteId) return

				this.loading = true
				const response = await this.axios.get(`/clientes/${this.clienteId}`)
				this.cliente = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadEstados() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/estados`)
				this.estados = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadCidades() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/cidades/estado/${this.estadoId}`)
				this.cidades = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async save() {
			if (!this.clienteId)
				this.addClientes()
			else
				this.alterarCliente()
		},
		async addClientes() {
			try {
				let userAdd = {
					nome: this.cliente.nome,
					sobrenome: this.cliente.sobrenome,
					email: this.cliente.email,
					cpf: this.cliente.cpf,
					cnh: this.cliente.cnh,
					telefone: this.cliente.telefone,
					celular: this.cliente.celular,
					dt_nascimento: this.dateNFormatted,
					tipo_cnh: this.cliente.tipo_cnh,
					municipioId: this.cidadeId
				}

				if (!this.endereco) {
					this.$store.dispatch('showError', 'Não foi informado endereço')
				}

				this.loading = true
				var response = await this.axios.post(`/clientes`, userAdd)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Cliente inserido com sucesso')
					this.$emit('dialogClose')
				} else {
					this.$store.dispatch('showError', response.data.msg)
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async alterarCliente() {
			try {
				let userAlter = {
					nome: this.cliente.nome,
					sobrenome: this.cliente.sobrenome,
					email: this.cliente.email,
					cpf: this.cliente.cpf,
					cnh: this.cliente.cnh,
					telefone: this.cliente.telefone,
					celular: this.cliente.celular,
					dt_nascimento: this.dateNFormatted ? this.dateNFormatted : this.cliente.dt_nascimento,
					tipo_cnh: this.cliente.tipo_cnh,
					municipioId: this.cidadeId
				}

				this.loading = true
				var response = await this.axios.put(`/clientes/${this.cliente.id}`, userAlter)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Cliente alterado com sucesso')
					this.$emit('dialogClose')
				} else {
					this.$store.dispatch('showError', response.data.msg)
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async resetarSenha(id) {
			this.$store.dispatch('showError', "Não foi configurado dados de e-mail")
		},
		blurDate() {
			setTimeout(() => {
				if (this.dateMenu) {
					this.dateMenu = false;
				}
			}, 200);
		},
		focusDate() {
			setTimeout(() => {
				if (!this.dateMenu) {
					this.dateMenu = true;
				}
			}, 200);
		},
		formatDate(date) {
			if (!date) return null

			const [year, month, day] = date.split('-')
			return `${day}/${month}/${year}`
		},

	},
	watch: {
		clienteId() {
			if (this.clienteId)
				this.loadClientes()
		},
		tab() {
			this.loadEstados()
		},
		estadoId() {
			console.log(this.estadoId)
			this.loadCidades()
		},
		'cliente.dt_nascimento'() {
			this.dateFormatted = this.formatDate(this.cliente.dt_nascimento.slice(0, 10))
		},
		dateNFormatted() {
			this.dateFormatted = this.formatDate(this.dateNFormatted)
		}
	}
}
</script>
