<template>
	<div class="experience">
		<div class="webgl" ref="webgl"></div>
		<tooltipComp></tooltipComp>
		<div class="chapter" ref="chapter">
			<div class="counter" ref="counter">Chap. {{toRoman(chapterNumber)}}/{{toRoman(this.$store.getters.exp.zones.length)}}</div>
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
			return this.$store.getters.exp.zones.filter(zone => zone.displayed).length + 1;
		},
		chapterName: function() {
			const zone = this.$store.getters.exp.zones.find(zone => zone.number == this.$store.getters.exp.animated.zone);
			return zone ? zone.name : '';
		}
	},

	watch: {
		'$store.getters.exp.animated.state': function(animationState) {
			if(animationState == 'beforeTitle') {
				this.tl.play();
			}
		}
	},

	mounted() {
		this.scene = new Scene(this.$refs.webgl, this.$store);
		this.canvas = this.scene.renderer.domElement;
		this.$refs.webgl.appendChild(this.canvas);

		this.tl = new TimelineLite({
			paused: true,
			onReverseComplete: () => {
				this.$store.dispatch('updateExpAnimationState', 'afterTitle');
			}
		});
		this.tl.set(this.$refs.chapter, {
			display: 'block'
		})
		.staggerTo([this.$refs.counter, this.$refs.name], 1, {
			opacity: 1,
			y: 0,
			onComplete: () => setTimeout(() => { this.tl.reverse(); }, 1500)
		}, 0.3);
	},

	methods: {
		toRoman(n) {
			const numerals = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
			return n.toString()
			.split('')
			.reverse()
			.reduce((p, c, i) => (c === '0' ? ''
				: c < '4' ? numerals[2 * i].repeat(c)
				: c === '4' ? numerals[2 * i] + numerals[2 * i + 1]
				: c < '9' ? numerals[2 * i + 1] + numerals[2 * i].repeat(c - 5)
				: numerals[2 * i] + numerals[2 * i + 2]) + p, '')
			;
		}
	},

	components: {
		tooltipComp
	}
};

</script>

<style lang="scss">

.experience {
	canvas {
		position: absolute;
		top: 0;
		left: 0;
	}

	.chapter {
		position: absolute;
		display: none;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 1;
		.counter {
			font-size: 36px;
			display: block;
			opacity: 0;
			transform: translateY(100%);
			color: #7e7e7e;
		}
		.name {
			margin-top: .3em;
			font-size: 72px;
			display: block;
			opacity: 0;
			transform: translateY(100%);
			color: #585858;
		}
	}
}
</style>
