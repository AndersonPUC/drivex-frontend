<template>
	<v-dialog v-model="clienteDialog" max-width="1024">
		<v-card>
			<v-card-title>
				<v-icon color="primary" left>person</v-icon>Cadastro de Cliente
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
					</template>
					<span>{{ usuario.id }}</span>
				</v-tooltip>
				<v-spacer></v-spacer>
				<v-btn icon @click="dialogClose">
					<v-icon color="primary">close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="2" md="2">
						<v-text-field label="ID" readonly v-model="usuario.id"></v-text-field>
					</v-col>
					<v-col cols="12" sm="5" md="5">
						<v-text-field label="Nome" v-model="usuario.nome"></v-text-field>
					</v-col>
					<v-col cols="12" sm="5" md="5">
                        <v-text-field label="Sobrenome" v-model="usuario.nome"></v-text-field>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="4" md="4">
						<v-text-field label="CPF" readonly v-model="usuario.id"></v-text-field>
					</v-col>
					<v-col cols="12" sm="5" md="5">
						<v-text-field label="CNH" v-model="usuario.nome"></v-text-field>
					</v-col>
					<v-col cols="12" sm="3" md="3">
                        <v-select label="Tipo CNH" :items="['A', 'B', 'A/B']" v-model="usuario.role"></v-select>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="4" md="4">
						<v-text-field label="Celular" readonly v-model="usuario.id"></v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="4">
						<v-text-field label="Telefone" v-model="usuario.nome"></v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="4">
                        <v-text-field label="Dt. Nascto" v-model="usuario.nome"></v-text-field>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="10" md="10">
						<v-text-field label="Email" readonly v-model="usuario.id"></v-text-field>
					</v-col>
					<v-col cols="12" sm="2" md="2">
						<v-btn text color="success" @click="alterarUsuario()"><v-icon left>mdi-open-in-new</v-icon>Endereço</v-btn>
					</v-col>
				</v-row>
				
				<v-row v-if="userAdmin">
					<v-btn color="success" @click="alterarUsuario()"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
					<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"><v-icon left>mdi-cancel</v-icon>Cancelar</v-btn>
					<v-btn color="primary" text @click="resetarSenha(usuario.id)"><v-icon left>mdi-lock-reset</v-icon>Resetar senha</v-btn>
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
		clienteId: String,
		dialog: Boolean
	},
	data: function() {
		return {
			usuario: {},
			loading: false,
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
	},
	methods: {
		dialogClose() {
			this.tab = null
			this.$emit('dialogClose')
		},
		async loadUsuario() {
			try {
				this.loading = true
				const response = await this.axios.get(`/usuarios/${this.usuarioId}`)
				this.usuario = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async alterarUsuario() {
			try {
				let userAlter = {
					nome: this.usuario.nome,
					email: this.usuario.email,
					role: this.usuario.role,
				}

				this.loading = true
				var response = await this.axios.put(`/usuarios/${this.usuario.id}`, userAlter)
				
				if(response.status == 200) {
					this.$store.dispatch('showSuccess', 'Usuário alterado com sucesso')
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
		usuarioId() {
			this.loadUsuario()
		},
	}
}
</script>
