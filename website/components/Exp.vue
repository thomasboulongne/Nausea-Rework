<template>
	<div>
		<div class="webgl" ref="webgl"></div>
		<tooltipComp></tooltipComp>
		<div class="chapter" ref="chapter">
			<div class="counter" ref="counter">Chap. {{chapterNumber}}/IV</div>
			<div class="name" ref="name">{{chapterName}}</div>
		</div>
	</div>
</template>

<script>

import Scene from '~/webgl/ExperienceScene';
import tooltipComp from '~/components/Tooltip';

export default {
	computed: {
		chapterNumber: function() {
			return this.$store.getters.exp.chapter.number;
		},
		chapterName: function() {
			return this.$store.getters.exp.chapter.name;
		}
	},

	mounted() {
		this.scene = new Scene(this.$refs.webgl, this.$store);
		this.canvas = this.scene.renderer.domElement;
		this.$refs.webgl.appendChild(this.canvas);
	},

	beforeDestroy() {
		this.scene.destructor();
	},

	components: {
		tooltipComp
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
