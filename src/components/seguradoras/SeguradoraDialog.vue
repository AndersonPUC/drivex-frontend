<template>
	<v-dialog v-model="seguradoraDialog" max-width="1024">
		<v-form ref="form">
			<v-card>
				<v-card-title>
					<v-icon color="primary" left>mdi-car-key</v-icon>Cadastro de Seguradoras
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
						</template>
						<span>{{ idSeguradora }}</span>
					</v-tooltip>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogClose">
						<v-icon color="primary">close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="4" md="4">
							<v-text-field label="CNPJ" v-model="seguradora.cnpj" v-mask="'##.###.###/####-##'"
								:rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="8" md="8">
							<v-text-field label="Nome Social" v-model="seguradora.nome_social"
								:rules="[rules.required]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="6" md="6">
							<v-text-field label="Nome fantasia" v-model="seguradora.nome_fantasia"
								:rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-text-field label="E-mail" v-model="seguradora.email"
								:rules="[rules.required, rules.email]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-btn color="success" @click="save()"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
						<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;" text><v-icon
								left>mdi-cancel</v-icon>Cancelar</v-btn>
						<v-btn color="error" @click="inativar()" style="margin-left: 3px; margin-right: 3px;"
							v-if="this.seguradora.id && this.seguradora.ativo"><v-icon left>mdi-delete</v-icon>Inativar</v-btn>
						<v-btn color="primary" @click="ativar()" style="margin-left: 3px; margin-right: 3px;"
							v-if="this.seguradora.id && !this.seguradora.ativo"><v-icon left>mdi-recycle</v-icon>Recuperar</v-btn>
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
		seguradoraId: String,
		dialog: Boolean
	},
	data: function () {
		return {
			seguradora: {},
			loading: false,
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
		seguradoraDialog: {
			get() {
				return this.dialog
			},
			set() {
				this.dialogClose()
			}
		},
		idSeguradora() {
			if (!this.seguradoraId) return "Novo"

			return this.seguradoraId
		}
	},
	methods: {
		dialogClose() {
			this.$refs.form.resetValidation()
			this.seguradora = {}
			this.$emit('dialogClose')
		},
		async loadSeguradoras() {
			try {
				if (this.seguradoraId == "0" || !this.seguradoraId) return

				this.loading = true
				const response = await this.axios.get(`/seguradoras/${this.seguradoraId}`)
				this.seguradora = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async save() {
			if (this.$refs.form.validate()) {
				if (!this.seguradoraId)
					this.addSeguradoras()
				else
					this.alterarSeguradora()
			}
		},
		async inativar() {
			this.setStatus(false)
		},
		async ativar() {
			this.setStatus(true)
		},
		async setStatus(status) {
			try {
				if (this.seguradoraId == "0" || !this.seguradoraId) return

				let req = {
					status: status
				}

				this.loading = true
				const response = await this.axios.put(`/seguradoras/${this.seguradoraId}/status`, req)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Seguradora alterado com sucesso.')
					this.dialogClose()
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async addSeguradoras() {
			try {
				let seguradoraAdd = {
					cnpj: this.seguradora.cnpj,
					nome_social: this.seguradora.nome_social,
					nome_fantasia: this.seguradora.nome_fantasia,
					email: this.seguradora.email,
				}

				this.loading = true
				var response = await this.axios.post(`/seguradoras`, seguradoraAdd)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Seguradora inserido com sucesso')
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
		async alterarSeguradora() {
			try {
				let seguradoraAlter = {
					cnpj: this.seguradora.cnpj,
					nome_social: this.seguradora.nome_social,
					nome_fantasia: this.seguradora.nome_fantasia,
					email: this.seguradora.email,
				}

				this.loading = true
				var response = await this.axios.put(`/seguradoras/${this.seguradora.id}`, seguradoraAlter)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'seguradora alterado com sucesso')
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
		async resetarSenha(id) {
			this.$store.dispatch('showError', "Não foi configurado dados de e-mail")
		}
	},
	watch: {
		seguradoraId() {
			if (this.seguradoraId)
				this.loadSeguradoras()
		},
	}
}
</script>
