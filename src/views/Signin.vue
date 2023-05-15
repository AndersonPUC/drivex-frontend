<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4">
			<v-card elevation="12">
				<v-card-title>
					<AppLogo />
				</v-card-title>
				<v-card-text>
					<v-form>
						<v-text-field v-model="email" label="E-mail" prepend-icon="person" type="email" />
						<v-text-field
							v-model="senha"
							label="Senha"
							prepend-icon="lock"
							type="password"
							@keypress.enter="login"
						/>
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
						<span style="font-size: 14px;">Novo aqui? <a href="/signup" style="color: #28cc9e; font-weight: bold; font-style: normal; text-decoration: none;">Cadastre-se</a> </span>
					</div>
				</v-card-actions>	
			</v-card>
		</v-col>
	</v-row>
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

				if (response.data.ativo === false) throw new 'Usuário inativo!'()

				this.$store.dispatch('login', response.data)
				
				this.$router.push('/')
			} catch (error) {
				this.showError('Usuário e/ou senha inválidos!')
			} finally {
				this.loading = false
			}
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
