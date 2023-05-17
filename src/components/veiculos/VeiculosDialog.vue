<template>
	<v-dialog v-model="veiculoDialog" max-width="1024">
		<v-card>
			<v-card-title>
				<v-icon color="primary" left>mdi-car-key</v-icon>Cadastro de veiculos
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-icon color="primary" right v-on="on">mdi-identifier</v-icon>
					</template>
					<span>{{ idVeiculo }}</span>
				</v-tooltip>
				<v-spacer></v-spacer>
				<v-btn icon @click="dialogClose">
					<v-icon color="primary">close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="4" md="4">
						<v-text-field label="Placa" v-model="veiculo.placa"></v-text-field>
					</v-col>
					<v-col cols="12" sm="4" md="4">
						<v-text-field label="Renavam" v-model="veiculo.renavam"></v-text-field>
					</v-col>
                    <v-col cols="12" sm="2" md="2">
						<v-text-field label="Ano fabricação" v-model="veiculo.ano_fabricacao"></v-text-field>
					</v-col>
                    <v-col cols="12" sm="2" md="2">
						<v-text-field label="Ano modelo" v-model="veiculo.ano_modelo"></v-text-field>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="6" md="6">
						<v-text-field label="Cor" v-model="veiculo.cor"></v-text-field>
					</v-col>
					<v-col cols="12" sm="3" md="3">
						<v-text-field label="Marca" v-model="veiculo.marca"></v-text-field>
					</v-col>
                    <v-col cols="12" sm="3" md="3">
						<v-text-field label="Modelo" v-model="veiculo.modelo"></v-text-field>
					</v-col>
				</v-row>
                <v-row>
					<v-col cols="12" sm="12" md="12">
						<v-select label="Categoria"></v-select>
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
		veiculoId: String,
		dialog: Boolean
	},
	data: function() {
		return {
			veiculo: {},
			loading: false,
		}
	},
	computed: {
		...mapGetters(['userAdmin']),
		...mapState(['user']),
		veiculoDialog: {
			get() {
				return this.dialog
			},
			set() {
				this.dialogClose()
			}
		},
		idVeiculo() {
			if(!this.veiculoId) return "Novo"

			return this.veiculoId
		}
	},
	methods: {
		dialogClose() {
			this.tab = null
			this.veiculo={}
			this.$emit('dialogClose')
		},
		async loadVeiculos() {
			try {
				if(this.veiculoId=="0" || !this.veiculoId) return

				this.loading = true
				const response = await this.axios.get(`/veiculos/${this.veiculoId}`)
				this.veiculo = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async save() {
			if(!this.veiculoId)
				this.addVeiculos()
			else 
				this.alterarVeiculo()
		},
		async addVeiculos() {
			try {
				let userAdd = {
					nome: this.veiculo.nome,
					sobrenome: this.veiculo.sobrenome,
					email: this.veiculo.email,
					cpf: this.veiculo.cpf,
					cnh: this.veiculo.cnh,
					telefone: this.veiculo.telefone,
					celular: this.veiculo.celular,
					dt_nascimento: this.veiculo.dt_nascimento,
					municipioId: 488
				}

				this.loading = true
				var response = await this.axios.post(`/veiculos`, userAdd)
				
				if(response.status == 200) {
					this.$store.dispatch('showSuccess', 'veiculo inserido com sucesso')
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
		async alterarVeiculo() {
			try {
				let userAlter = {
					nome: this.usuario.nome,
					email: this.usuario.email,
					role: this.usuario.role,
				}

				this.loading = true
				var response = await this.axios.put(`/veiculos/${this.usuario.id}`, userAlter)
				
				if(response.status == 200) {
					this.$store.dispatch('showSuccess', 'veiculo alterado com sucesso')
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
		veiculoId() {
			if(this.veiculoId)
				this.loadVeiculos()
		},
	}
}
</script>
