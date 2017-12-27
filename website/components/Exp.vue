<template>
	<div>
		<div class="webgl" ref="webgl"></div>
	</div>
</template>

<script>

import Scene from '~/webgl/ExperienceScene';

export default {
	data() {
		return {
			obj: true
		};
	},

	watch: {
	},

	mounted() {
		this.scene = new Scene(this.$refs.webgl, this.$store);
		this.canvas = this.scene.renderer.domElement;
		this.$refs.webgl.appendChild(this.canvas);
	},

	beforeDestroy() {
		this.scene.destructor();
	},

	methods: {
	}
};

</script>

<style lang="scss">

canvas {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
