<template>
	<div>
		<div class="webgl" ref="webgl"></div>
		<span class="home-tooltip" ref="tooltip">Maintenez votre curseur sur l'homme<br>pour entrer dans l'expérience</span>
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

	watch: {
		'$store.getters.home': function(val) {
			if(val == 'endEnter') {
				this.showTooltip();
			}
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

	methods: {
		showTooltip() {
			if(this.$refs.tooltip) {
				TweenLite.to(this.$refs.tooltip, 0.8, {
					opacity: 1,
					y: 0,
					ease: Power3.easeOut
				});
			}
		}
	}
};

</script>

<style lang="scss">

canvas {
	position: absolute;
	top: 0;
	left: 0;
}

.home-tooltip {
	text-align: center;
	position: absolute;
	bottom: 13%;
	left: 50%;
	transform: translate(-50%, 100%);
	text-transform: uppercase;
	color: #bbb;
	font-size: 11px;
	font-family: 'Gotham-Book';
	line-height: 2em;
	letter-spacing: 1px;
	opacity: 0;
}
</style>
