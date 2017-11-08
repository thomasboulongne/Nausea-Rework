<template>
	<section class="container">
		<loadingComp></loadingComp>
		<homeComp v-if="$store.getters.loaded"></homeComp>
	</section>
</template>

<script>
import loadingComp from '~components/Loading';
import homeComp from '~components/Home';

export default {
	computed: {
		loaded: function() {
			return this.$store.getters.loaded;
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
