<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="5" md="5">
				<v-card elevation="12">
					<v-card-title>
						<AppLogo />
					</v-card-title>
					<v-card-text>
						<v-form>
							<v-text-field v-model="email" label="E-mail" prepend-icon="person" type="email" />
							<v-text-field v-model="senha" label="Senha" prepend-icon="lock" type="password" @keypress.enter="login" />
							<v-row align="center" justify="center">
								<v-progress-circular v-if="loading" indeterminate />
							</v-row>
						</v-form>
					</v-card-text>
					<v-divider/>
					<v-card-actions>
						<v-btn v-if="!loading" @click="login" color="primary" width="150">Entrar</v-btn>
						<v-spacer/>
						<div>
							<span style="font-size: 14px;">Novo aqui? <a href="/signup" style="color: #1976d2; font-weight: bold; font-style: normal; text-decoration: none;">Cadastre-se</a> </span>
						</div>
					</v-card-actions>	
				</v-card>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
			<v-col cols="12" sm="5" md="5">
				<v-card elevation="12">
					<v-alert border="left" icon="mdi-information-outline" text type="info">
						Dados de acesso para <b>testes</b> na plataforma. Para preencher automaticamente, selecione alguma conta na tabela a seguir.
						<v-data-table :headers="headers" :items="items" class="elevation-1" @click:row="usuarioSelected" dense hide-default-footer/>
					</v-alert>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	
</template>
<script>
import AppLogo from '@/components/widgets/AppLogo'
import { mapActions } from 'vuex'

export default {
	components: { AppLogo },
	data: function () {
		return {
			email: '',
			senha: '',
			loading: false,
			headers: [
					{ text: 'Tipo', value: 'tipo' },
					{ text: 'E-mail', value: 'email' },
					{ text: 'Senha', value: 'senha' },
				],
			items: [
				{
					tipo: 'Administrador (Suporte)',
					email: 'admin@drivex.com.br',
					senha: 'admin'
				},
				{
					tipo: 'Locadora',
					email: 'locadora@drivex.com.br',
					senha: 'locadora'
				},
				{
					tipo: 'Seguradora',
					email: 'seguradora@drivex.com.br',
					senha: 'seguradora'
				}

			]
		}
	},
	methods: {
		...mapActions(['showError']),
		async login() {
			try {
				this.loading = true
				if (!this.email || this.email === '') throw 'Email inválido!'
				if (!this.senha || this.senha === '') throw 'Senha inválida!'

				const response = await this.axios.post('/signin', { email: this.email, senha: this.senha })
				if (response.data.inativo === true) throw 'Usuário inativo!'

				this.$store.dispatch('login', response.data)
				
				this.$router.push('/')
			} catch (error) {
				this.showError('Usuário e/ou senha inválidos.')
			} finally {
				this.loading = false
			}
		},
		usuarioSelected(usuario) {
			this.email = usuario.email,
			this.senha = usuario.senha
		},
		checkUser() {
			if (this.$store.getters.userAtivo) return this.$router.push('/')
		},
	},
	mounted() {
		this.checkUser()
	},
}
</script>
