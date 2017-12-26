<template>
	<div>
		<div class="loading" ref="loading">
			<img id="home-logo" src="/images/logo_sm_white.png" alt="">
			<span id="home-percentage">{{percentage}}%</span>
			<div id="hp-warning">
				<img src="/images/headphones.svg" alt="">
				<span>Better with headphones</span>
			</div>
		</div>
		<div class="quote" ref="quote">
			<div class="container">
				<span>Jamais,</span>
				<span> avant </span>
				<span>ces </span>
				<span>derniers </span>
				<span>jours, </span>
				<span>je </span>
				<span>n'avais </span>
				<span>pressenti </span>
				<span>ce </span>
				<span>que </span>
				<span>voulait </span>
				<span>dire </span>
				<span>exister.</span>
			</div>
		</div>
	</div>
</template>

<script>
import SoundManager from '~/core/SoundManager';

export default {
	data() {
		return {
			skip: true
		};
	},

	computed: {
		percentage: function() {
			return Math.floor(this.$store.getters.loadedPercentage);
		}
	},

	watch: {
		percentage: function(val) {
			if(val == 100) {
				this.$store.dispatch('hasLoaded');
				if(!this.skip) {
					this.animateQuote();
				} else {
					this.$store.dispatch('updateWebglHome', 'cursorReady');
					TweenLite.set(this.$el, {
						display: 'none'
					});
				}
			}
		}
	},

	methods: {
		animateQuote() {
			const tl = new TimelineLite({
				paused: true,
				onComplete: () => {
					let tlOut = new TimelineLite();
					tlOut.to(this.$refs.quote, 2, {
						opacity: 0,
						onComplete: () => {
							this.$store.dispatch('updateWebglHome', 'cursorReady');
							TweenLite.set(this.$el, {
								display: 'none'
							});
						}
					});
				}
			});

			tl.to(this.$refs.loading, 2, {
				opacity: 0,
				delay: 1
			})
			.add(() => {
				SoundManager.play('01');
			})
			;

			const words = Array.from(this.$refs.quote.querySelector('.container').children);

			words.forEach((word, i) => {
				let duration = 0.3;
				let delay = 0;

				switch(i) {
					case 0: // Jamais,
						duration = 1.2;
						delay = 0;
						break;
					case 1: // avant
						duration = 2;
						delay = -0.3;
						break;
					case 5: // je
						duration = 2;
						delay = 0.2;
						break;
					case 12: // exister
						duration = 3;
						delay = -0.6;
						break;
					default:
						duration = 2;
						delay = -1.8;
						break;
				}

				tl.to(word, duration, {
					opacity: 1,
					y: 0,
					ease: Power3.easeOut,
					delay: delay
				});
			});

			tl.play();
		}
	}
};

</script>

<style lang="scss">
@import '~assets/scss/main.scss';

.loading {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 3;
	background-color: #000000;
	opacity: 1;
	background-image: url('/images/noise.png');

	#home-logo {
		position: absolute;
		z-index: 2;
		top: 50%;
		left: 50%;
		width: 20vw;
		transform: translate(-50%, -50%);
	}

	#home-percentage {
		position: absolute;
		z-index: 2;
		top: 65%;
		left: 50%;
		font-size: 30px;
		color: #cdcdcd;
		transform: translate(-50%, -50%);
	}

	#hp-warning {
		text-align: center;
		position: absolute;
		z-index: 2;
		left: 50%;
		bottom: 5%;
		transform: translateX(-50%);
		text-transform: uppercase;
		span {
			margin-top: 1em;
			display: block;
			font-size: 14px;
			font-family: 'Gotham-Book'
		}

		img {
			margin: auto;
		}
	}
}

.quote {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-image: url('/images/background_quote.png');
	background-size: cover;
	background-repeat: no-repeat;
	z-index: 2;
	.container {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-wrap: wrap;
		width: 33rem;
		justify-content: center;
		align-items: center;
		span {
			font-family: 'BaskervilleMT';
			opacity: 0;
			transform: translateY(0.3em);
			white-space: pre;
			display: inline-block;
			color: $third-color;
			font-size: 44px;
			line-height: 2em;
			font-weight: 100;
		}
	}
}

</style>
