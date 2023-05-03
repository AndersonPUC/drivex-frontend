<template>
	<v-main>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col cols="12" sm="8" md="5">
					<v-card elevation="12">
						<v-card-title>
							<AppLogo />
						</v-card-title>
						<v-card-text>
							<v-text-field
								v-model="nome"
								label="Nome"
								prepend-icon="person"
								type="text"
								required
								:disabled="loading"
							/>
							<v-text-field
								v-model="email"
								label="E-mail"
								prepend-icon="email"
								type="email"
								required
								:disabled="loading"
							/>
							<v-text-field
								v-model="senha"
								label="Senha"
								prepend-icon="lock"
								type="password"
								required
								:disabled="loading"
							/>
							<v-text-field
								v-model="confirmaSenha"
								label="Confirmação Senha"
								prepend-icon="lock"
								type="password"
								required
								:disabled="loading"
							/>	
						</v-card-text>
						<v-card-actions>
							<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
							<v-btn v-if="!loading" to="Signin" color="primary" text>Voltar</v-btn>
							<v-spacer />
							<v-btn v-if="!loading" color="primary" @click="signup">Cadastrar</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-main>
</template>
<script>
import { mapActions } from 'vuex'
import AppLogo from '@/components/widgets/AppLogo'

export default {
	components: { AppLogo },
	data: function() {
		return {
			nome: '',
			email: '',
			senha: '',
			confirmaSenha: '',
			loading: false,
		}
	},
	methods: {
		...mapActions(['showError', 'showSuccess']),
		async signup() {
			try {
				this.loading = true
				if (this.nome.length < 3) return this.showError('Nome muito curto')

				if (
					!String(this.email)
						.toLowerCase()
						.match(
							/^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						)
				) return this.showError('E-mail inválido!')

				if (this.senha.length < 3) return this.showError('Senha muito curta!')
				if (this.senha !== this.confirmaSenha) return this.showError('As duas senhas precisam ser iguais!')

				await this.axios.post('/signup', { nome: this.nome, email: this.email, senha: this.senha })
				this.showSuccess('Usuário cadastrado!')
				this.resetaCampos()
			} catch (error) {
				this.showError(error)
			} finally {
				this.loading = false
			}
		},
		resetaCampos() {
			this.nome = this.senha = this.confirmaSenha = this.email = ''
			this.cidade = this.cidades[0]
		}
	}
}
</script>