<template>
	<section class="container">
		<loadingComp></loadingComp>
		<homeComp v-if="loaded && $store.getters.home.displayed"></homeComp>
		<expComp v-else-if="$store.getters.exp.displayed"></expComp>
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
		'$store.getters.home.state': function(val) {
			if(val == 'afterLeave') {
				this.goToExperience();
			}
		}
	},

	methods: {
		goToExperience() {
			this.$store.dispatch('updateWebglExpDisplay', true);
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
