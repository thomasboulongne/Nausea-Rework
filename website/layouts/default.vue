<template>
	<div>
		<nuxt/>
	</div>
</template>

<script>


export default {
	mounted() {
		const getAll = require('~core/WebglAssets').getAll;
		getAll(this.$store);
		this.updateViewportSize();
		this.addEventListeners();
	},

	beforeDestroy() {
		this.removeEventListeners();
	},

	methods: {
		updateViewportSize() {
			this.$store.dispatch('updateViewportSize', {width: window.innerWidth, height: window.innerHeight});
		},

		updateScrollPosition() {
			let position = [window.scrollX || window.scollLeft || document.getElementsByTagName('html')[0].scrollLeft, window.scrollY || window.scollTop || document.getElementsByTagName('html')[0].scrollTop];
			this.$store.dispatch('updateScrollPosition', {x: position[0], y: position[1]});
		},

		addEventListeners() {
			window.addEventListener('resize', this.updateViewportSize);
			window.addEventListener('scroll', this.updateScrollPosition);
		}
	}
};
</script>
