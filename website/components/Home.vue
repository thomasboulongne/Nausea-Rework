<template>
	<div class="webgl">
	</div>
</template>

<script>
	
import Scene from '~/webgl/HomeScene';

export default {
	data() {
		return {
			obj: true
		};
	},

	mounted() {
		this.scene = new Scene(this.$el, this.$store);
		this.canvas = this.scene.renderer.domElement;
		this.$el.appendChild(this.canvas);
	},

	beforeDestroy() {
		this.scene.destructor();
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
