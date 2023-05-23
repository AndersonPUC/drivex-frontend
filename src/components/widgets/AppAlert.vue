<template>
	<v-snackbar v-model="alert.visible" :color="alert.color">
		{{ alert.msg }}
		<v-btn text @click="alert.visible = false">Fechar</v-btn>
	</v-snackbar>

	<!--
		<div>
			<v-alert type="success">
				I'm a success alert.
			</v-alert>
			<v-alert type="info">
				I'm an info alert.
			</v-alert>
			<v-alert type="warning">
				I'm a warning alert.
			</v-alert>
			<v-alert type="error">
				I'm an error alert.
			</v-alert>
		</div>
	-->
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		computed: mapState(['alert'])
	}
</script>
