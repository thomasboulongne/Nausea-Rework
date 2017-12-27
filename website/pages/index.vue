<template>
	<section class="container">
		<loadingComp></loadingComp>
		<homeComp v-if="loaded && $store.getters.home != 'closed'"></homeComp>
		<expComp v-else-if="$store.getters.home == 'closed'"></expComp>
	</section>
</template>

<script>
import loadingComp from '~/components/Loading';
import homeComp from '~/components/Home';
import expComp from '~/components/Exp';

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
			this.$store.dispatch('updateWebglHome', 'closed');
		}
	},

	components: {
		loadingComp,
		homeComp,
		expComp
	}
};

</script>

<style lang="scss">
@import '~assets/scss/main.scss';

.container
{
}
</style>
