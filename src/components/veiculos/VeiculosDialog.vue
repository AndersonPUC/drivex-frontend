<template>
	<v-dialog v-model="veiculoDialog" max-width="1024">
		<v-form ref="form">
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
							<v-text-field label="Placa" v-mask="maskPlaca" v-model="veiculo.placa" @focus="onFocus"
								:rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="4" md="4">
							<v-text-field label="Renavam" v-model="veiculo.renavam"
								v-mask="maskRenavam" :rules="[rules.required]" @focus="onFocus"></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="Ano fabricação" v-model="veiculo.ano_fabricacao" v-mask="maskAno"
								:rules="[rules.required]" @focus="onFocus"></v-text-field>
						</v-col>
						<v-col cols="12" sm="2" md="2">
							<v-text-field label="Ano modelo" v-model="veiculo.ano_modelo" v-mask="maskAno"
								:rules="[rules.required]" @focus="onFocus"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="6" md="6">
							<v-text-field label="Cor" v-model="veiculo.cor" :rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-text-field label="Marca" v-model="veiculo.marca" :rules="[rules.required]"></v-text-field>
						</v-col>
						<v-col cols="12" sm="3" md="3">
							<v-text-field label="Modelo" v-model="veiculo.modelo" :rules="[rules.required]"></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-select label="Categoria" :items="categorias" item-text="categoria" item-value="id"
								v-model="categoriaId" :rules="[rules.required]"></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-btn color="success" @click="save()"><v-icon left>mdi-content-save</v-icon>Salvar</v-btn>
						<v-btn color="error" @click="dialogClose" style="margin-left: 3px; margin-right: 3px;" text><v-icon
								left>mdi-cancel</v-icon>Cancelar</v-btn>
						<v-btn color="error" @click="inativar()" style="margin-left: 3px; margin-right: 3px;"
							v-if="this.veiculo.id && this.veiculo.ativo"><v-icon left>mdi-delete</v-icon>Inativar</v-btn>
						<v-btn color="primary" @click="ativar()" style="margin-left: 3px; margin-right: 3px;"
							v-if="this.veiculo.id && !this.veiculo.ativo"><v-icon left>mdi-recycle</v-icon>Recuperar</v-btn>
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
		veiculoId: String,
		dialog: Boolean,
	},
	data: function () {
		return {
			veiculo: {},
			loading: false,
			categorias: [],
			categoriaId: '',
			maskPlaca:'',
			maskRenavam: '',
			maskAno: '',
			rules: {
				required: value => !!value || 'Informe um valor.',
			},
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
				this.veiculo = {}
				this.dialogClose()
			}
		},
		idVeiculo() {
			if (!this.veiculoId) return "Novo"

			return this.veiculoId
		}
	},
	methods: {
		onFocus() {
			this.maskPlaca = 'NNN-NNNN'
			this.maskRenavam = '###########'
			this.maskAno = '####'
		},
		dialogClose() {
			this.$refs.form.resetValidation()
			this.veiculo = {}
			this.categoriaId={}
			this.$emit('dialogClose')

		},
		async loadVeiculos() {
			try {
				if (this.veiculoId == "0" || !this.veiculoId) return

				this.loading = true
				const response = await this.axios.get(`/veiculos/${this.veiculoId}`)
				this.veiculo = response.data
				this.categoriaId = this.veiculo.categoriumId
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async loadCategorias() {
			try {
				this.loading = true
				const response = await this.axios.get('/manager/categorias')
				this.categorias = response.data
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async save() {
			if (this.$refs.form.validate()) {
				if (!this.veiculoId)
					this.addVeiculos()
				else
					this.alterarVeiculo()
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
				if (this.veiculoId == "0" || !this.veiculoId) return

				let req = {
					status: status
				}

				this.loading = true
				const response = await this.axios.put(`/veiculos/${this.veiculoId}/status`, req)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'Cliente alterado com sucesso.')
					this.dialogClose()
					//this.$emit('dialogClose')
				}
			} catch (error) {
				this.$store.dispatch('showError', error)
			} finally {
				this.loading = false
			}
		},
		async addVeiculos() {
			try {
				let veiculoAdd = {
					marca: this.veiculo.marca,
					modelo: this.veiculo.modelo,
					ano_fabricacao: this.veiculo.ano_fabricacao,
					ano_modelo: this.veiculo.ano_modelo,
					cor: this.veiculo.cor,
					placa: this.veiculo.placa,
					renavam: this.veiculo.renavam,
					categoria_id: this.categoriaId
				}

				this.loading = true
				var response = await this.axios.post(`/veiculos`, veiculoAdd)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'veiculo inserido com sucesso')
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
		async alterarVeiculo() {
			try {
				let veiculoAlter = {
					marca: this.veiculo.marca,
					modelo: this.veiculo.modelo,
					ano_fabricacao: this.veiculo.ano_fabricacao,
					ano_modelo: this.veiculo.ano_modelo,
					cor: this.veiculo.cor,
					placa: this.veiculo.placa,
					renavam: this.veiculo.renavam,
					categoria_id: this.categoriaId
				}

				this.loading = true
				var response = await this.axios.put(`/veiculos/${this.veiculo.id}`, veiculoAlter)

				if (response.status == 200) {
					this.$store.dispatch('showSuccess', 'veiculo alterado com sucesso')
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
		veiculoId() {
			
			if (this.veiculoId) {
				this.veiculo = {}
				this.loadVeiculos()
			}
		},
		categoriaId
	},
	mounted() {
		this.loadCategorias()
	}
}
</script>
