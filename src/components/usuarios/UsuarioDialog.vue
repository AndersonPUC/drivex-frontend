<template>
	<v-dialog v-model="usuarioDialog" max-width="1024">

		<v-form ref="form">
			<v-card>
				<v-card-title>
					<v-icon color="primary" left>mdi-account-group</v-icon>Cadastro de Usuário
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
							<v-text-field label="Nome" :readonly="!userAdmin" v-model="usuario.nome"></v-text-field>
						</v-col>
						<v-col cols="12" sm="5" md="5">
							<v-select label="Grupo de usuário" :readonly="!userAdmin" :items="roles" item-text="role"
								item-value="id" v-model="usuario.role" :rules="[rules.required]"></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="7" sm="7" md="7">
							<v-text-field label="E-mail" :readonly="!userAdmin" v-model="usuario.email"
								:rules="[rules.required, rules.email]"></v-text-field>
						</v-col>
						<v-col cols="5" sm="5" md="5">
							<v-select label="Seguradora" :readonly="!userAdmin" :items="seguradoras" item-text="nome_fantasia"
								item-value="id" v-model="usuario.seguradoraId" :rules="[rules.required]"></v-select>
						</v-col>
					</v-row>
					<v-row v-if="userAdmin">
						<v-btn color="success" @click="alterarUsuario()"><v-icon
								left>mdi-content-save</v-icon>Salvar</v-btn>
						<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;"><v-icon
								left>mdi-cancel</v-icon>Cancelar</v-btn>
						<v-btn color="primary" text @click="resetarSenha(usuario.id)"><v-icon
								left>mdi-lock-reset</v-icon>Resetar senha</v-btn>
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
		usuarioId: String,
		dialog: Boolean
	},
	data: function () {
		return {
			usuario: {},
			loading: false,
			seguradoras: [],
			roles: [
				{
					id: 'admin_role',
					role: 'Administrador'
				}, 
				{
					id: 'rental_role',
					role: 'Locadora'
				},
				{
					id: 'insurance_role',
					role: 'Seguradora'
				},
				{
					id: 'user_role',
					role: 'Usuário'
				}],
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
		usuarioDialog: {
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
			if (this.$refs.form.validate()) {
				try {
					let userAlter = {
						nome: this.usuario.nome,
						email: this.usuario.email,
						role: this.usuario.role,
						seguradoraId: this.usuario.seguradoraId,
					}

					this.loading = true
					var response = await this.axios.put(`/usuarios/${this.usuario.id}`, userAlter)

					if (response.status == 200) {
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
			}
		},
		async loadSeguradoras() {
			try {
				this.loading = true
				const response = await this.axios.get(`/manager/seguradoras`)
				this.seguradoras = response.data
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
			this.loadSeguradoras()
		},
	}
}
</script>
