<template>
	<div class="tooltip">
		<img :src="img" alt="" ref="img">
		<span ref="text">{{ text }}</span>
	</div>
</template>

<script>
import SoundManager from '~/core/SoundManager';

export default {
	computed: {
		img: function() {
			return this.$store.getters.exp.tooltip.img;
		},
		text: function() {
			return this.$store.getters.exp.tooltip.text;
		}
	},

	watch: {
		'$store.getters.exp.tooltip.displayed': function(val) {
			if(val) {
				this.showTooltip();
			} else {
				this.hideTooltip();
			}
		}
	},

	mounted() {
		this.tlShow = new TimelineLite();
		this.tlShow.pause();
		this.tlShow.to(this.$el, 0.5, {
			display: 'flex',
			width: '350px'
		})
		.to([this.$refs.img, this.$refs.text], 0.4, {
			display: 'block',
			opacity: 1,
			y: 0
		})
		.to(this.$el, 1, {
			top: '10%',
			ease: Power3.easeInOut
		}, 4);

		this.tlHide = new TimelineLite();
		this.tlHide.pause();
		this.tlHide.to([this.$refs.img, this.$refs.text], 0.2, {
			opacity: 0,
			y: '10%'
		})
		.to(this.$el, 0.3, {
			width: 0,
			ease: Power3.easeInOut
		}, 0.2)
		.set([this.$refs.img, this.$refs.text], {
			display: 'none'
		})
		.set(this.$el, {
			display: 'none',
			top: '50%'
		});
	},

	methods: {
		showTooltip() {
			SoundManager.play('tip');
			this.tlShow.play();
		},

		hideTooltip() {
			this.tlHide.play();
		}
	}
};

</script>

<style lang="scss">
@import '~assets/scss/main.scss';

.tooltip {
	display: none;
	align-items: center;
	z-index: 2;
	width: 0;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: $white-bright;
	font-family: 'BaskervilleMT';
	box-shadow: 0 0 10px 4px rgba(170, 170, 170, 0.5);
	height: 90px;
	img {
		height: 100%;
		margin-right: 1em;
		display: none;
	}
	span {
		display: none;
		flex-grow: 1;
		padding: 1.5em;
	}
}
</style>
