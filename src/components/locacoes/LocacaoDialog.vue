<template>
	<v-dialog v-model="locacaoDialog" max-width="1024">
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
						<v-text-field label="ID"></v-text-field>
					</v-col>
					<v-col cols="12" sm="3" md="3">
						<v-text-field label="PREV. ENTREGA" append-icon="mdi-calendar"></v-text-field>
					</v-col>
					<v-col cols="12" sm="3" md="3">
						<v-text-field label="DT. LOCAÇÃO" append-icon="mdi-calendar"></v-text-field>
					</v-col>
					<v-col>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

export default {
	props: {
		locacaoId: String,
		dialog: Boolean
	},
	data: function() {
		return {
			locacao: {},
			loading: false,
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
			if(!this.locacaoId) return "Novo"

			return this.locacaoId
		}
	},
	methods: {
		dialogClose() {
			this.tab = null
			this.seguradora={}
			this.$emit('dialogClose')
		},
		async loadSeguradoras() {
			try {
				// if(this.seguradoraId=="0" || !this.seguradoraId) return

				// this.loading = true
				// const response = await this.axios.get(`/seguradoras/${this.seguradoraId}`)
				// this.seguradora = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async save() {
			if(!this.seguradoraId)
				this.addSeguradoras()
			else 
				this.alterarSeguradora()
		},
		async addSeguradoras() {
			try {
				let userAdd = {
					nome: this.seguradora.nome,
					sobrenome: this.seguradora.sobrenome,
					email: this.seguradora.email,
					cpf: this.seguradora.cpf,
					cnh: this.seguradora.cnh,
					telefone: this.seguradora.telefone,
					celular: this.seguradora.celular,
					dt_nascimento: this.seguradora.dt_nascimento,
					municipioId: 488
				}

				this.loading = true
				var response = await this.axios.post(`/seguradoras`, userAdd)
				
				if(response.status == 200) {
					this.$store.dispatch('showSuccess', 'Seguradora inserido com sucesso')
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
		async alterarSeguradora() {
			try {
				let userAlter = {
					nome: this.usuario.nome,
					email: this.usuario.email,
					role: this.usuario.role,
				}

				this.loading = true
				var response = await this.axios.put(`/seguradoras/${this.usuario.id}`, userAlter)
				
				if(response.status == 200) {
					this.$store.dispatch('showSuccess', 'seguradora alterado com sucesso')
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
		}
	},
	watch: {
		locacaoId() {
			if(this.locacaoId)
				this.loadSeguradoras()
		},
	}
}
</script>
