<template>
	<div class="home">
		<v-card :loading="loading">
			<v-card-title>
				<v-icon left color="primary">mdi-home-city</v-icon>Empresa 
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col cols="12" sm="2">
						<v-text-field label="ID" readonly v-model="empresa.id"></v-text-field>
					</v-col>
					<v-col cols="12" sm="10">
						<v-text-field label="Nome" readonly v-model="empresa.nome"></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12" sm="7">
						<v-text-field label="Endereço" readonly v-model="empresa.endereco"></v-text-field>
					</v-col>
					<v-col cols="12" sm="3">
						<v-text-field label="Estado" readonly v-model="empresa.estado"></v-text-field>
					</v-col>
					<v-col cols="12" sm="2">
						<v-text-field label="UF" readonly v-model="empresa.uf"></v-text-field>
					</v-col>
				</v-row>
			</v-card-text>

			<!-- <v-card-actions>
				<v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
			</v-card-actions> -->
		</v-card>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	
	export default {
		name: 'Home',
		data: function() {
			return {
				loading: false,
				dialog: false,
				empresa: {}
			}
		},
		methods: {
			async loadEmpresa() {
				try {
					this.loading = true
					const response = await this.axios.get(`/empresas/${this.user.empresaId}`)
					this.empresa = response.data

				} catch (error) {
					this.$store.dispatch('showError', error)
				} finally {
					this.loading = false
				}
			},
		},
		computed: {
			...mapGetters(['userAdmin']),
			...mapState(['user'])
		},
		mounted() {
			this.loadEmpresa()
		},
	}
</script>
