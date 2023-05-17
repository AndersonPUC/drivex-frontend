<template>
	<v-dialog v-model="seguradoraDialog" max-width="1024">
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
						<v-text-field label="CNPJ" v-model="seguradora.cnpj"></v-text-field>
					</v-col>
					<v-col cols="12" sm="8" md="8">
						<v-text-field label="Nome Social" v-model="seguradora.nome_social"></v-text-field>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="6" md="6">
						<v-text-field label="CNPJ" v-model="seguradora.nome_fantasia"></v-text-field>
					</v-col>
					<v-col cols="12" sm="6" md="6">
						<v-text-field label="Nome Social" v-model="seguradora.email"></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-btn color="success" @click="save()"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
					<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"><v-icon left>mdi-cancel</v-icon>Cancelar</v-btn>
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
		seguradoraId: String,
		dialog: Boolean
	},
	data: function() {
		return {
			seguradora: {},
			loading: false,
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
			if(!this.seguradoraId) return "Novo"

			return this.seguradoraId
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
				if(this.seguradoraId=="0" || !this.seguradoraId) return

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
		seguradoraId() {
			if(this.seguradoraId)
				this.loadSeguradoras()
		},
	}
}
</script>
