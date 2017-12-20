<template>
	<section class="container">
		<loadingComp></loadingComp>
		<homeComp v-if="$store.getters.loaded"></homeComp>
	</section>
</template>

<script>
import loadingComp from '~/components/Loading';
import homeComp from '~/components/Home';

export default {
	computed: {
		loaded: function() {
			return this.$store.getters.loaded;
		}
	},

	watch: {
		'$store.getters.home': function(val) {
			if(val == 'goToExperience') {
				this.goToExperience();
			}
		}
	},

	methods: {
		goToExperience() {
			console.log('goToExperience');
		}
	},

	components: {
		loadingComp,
		homeComp
	}
};

</script>

<style lang="scss">
@import '~assets/scss/main.scss';

.container
{
}
</style>
