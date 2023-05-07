<template>
	<v-snackbar v-model="alert.visible" :color="alert.color">
		{{ alert.msg }}
		<v-btn text @click="alert.visible = false">Fechar</v-btn>
	</v-snackbar>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		computed: mapState(['alert'])
	}
</script>
