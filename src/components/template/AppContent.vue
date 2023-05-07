<template>
	<v-main>
		<v-container :class="!user ? 'fill-height' : ''" fluid>
			<v-fade-transition mode="out-in">
				<router-view />
			</v-fade-transition>
		</v-container>
	</v-main>
</template>
<script>
	import { mapState } from 'vuex'
	export default {
		metaInfo() {
			return {
				title: 'DriveX Admin'
			}
		},
		computed: {
			...mapState(['user'])
		}
	}
</script>
