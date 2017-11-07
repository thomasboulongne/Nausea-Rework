<template>
	<section class="container">
		<loadingComp></loadingComp>
	</section>
</template>

<script>
import loadingComp from '~components/Loading';

export default {
	computed: {
		loaded: function() {
			return this.$store.getters.loaded;
		}
	},
	components: {
		loadingComp
	}
};

</script>

<style lang="scss">
@import '~assets/scss/main.scss';

.container
{
}
</style>
