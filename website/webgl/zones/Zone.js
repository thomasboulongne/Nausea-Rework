import SoundManager from '~/core/SoundManager';

import * as NumberUtils from '../utils/NumberUtils';

class Zone extends THREE.Group {
	constructor(Store, {controlsContainer, orientation = { x: [0, 0], y: [0, 0] }, zoomParams = {strength: 0.0025}, name = '', number = 0, soundId = 0, willAnimate = true}) {
		super();
		this.Store = Store;

		this.controlsContainer = controlsContainer;
		this.zoomParams = zoomParams;

		this.soundId = soundId;

		this.animated = false;

		this.orientation = orientation;
		this.number = number;
		this.soundsEndZone = ['04', '10'];
		SoundManager.get('materialize').volume(0.35);

		this.addObjects();

		this.animateSpline = false;

		if(willAnimate) {
			this.timelineInit();
		}

		this.addEventListeners();

		this.Store.dispatch('addZone', {name: name, number: number});
	}

	addEventListeners() {
		this.Store.watch((state, getters) => getters.exp.animated.state, animationState => {
			if(animationState == 'afterTitle' && this.Store.getters.exp.animated.zone == this.number) {
				this.playTimeline();
			}
		});
	}

	addObjects() {
		throw new Error('addObjects is not implemented in this zone');
	}

	timelineInit() {
		// this.initHoverTimeline();

		// Sound
		// Spline
		// Post Process

		this.timeline = new TimelineMax({
			paused: true,
			onComplete: () => {
				setTimeout(() => {
					this.animateSpline = false;
				}, 200);
				this.Store.dispatch('endZoneAnimation', this.number);
			}
		});

		const soundDuration = SoundManager.get(this.soundId).duration().toFixed(2);
		this.splineAnimationTime = { time: 0 };

		this.timeline.add('start');

		this.timeline.add(() => {
			SoundManager.play(this.soundId);
			SoundManager.play('materialize');
		}, 'start');

		this.timeline.add(() => {
			this.animateSpline = true;
		}, 'start');

		this.timeline.to(this.splineAnimationTime, soundDuration, {
			time: 1,
			ease: Circ.easeOut
		}, 'start');

		this.timeline.add('reverse');

		this.timeline.add(() => {
			SoundManager.play('back');
		}, 'reverse');

		this.timeline.to(this.splineAnimationTime, soundDuration / 2, {
			time: 0,
			ease: Circ.easeIn
		}, 'reverse');
	}

	playTimeline() {
		this.timeline.play();
	}

	playAnimation() {
		this.animated = true;
		this.children.forEach(obj => {
			obj.material.transparent = false;
		});

		this.zoomParams.strength = 0.020;

		this.children.forEach(object => {
			if(object.options.rotate) {
				this.timeline.to(object.mesh.rotation, 11, { 'y': NumberUtils.toRadians(object.roty), ease: Circ.easeInOut }, '0');
			}

			if(!(object.options.materialize)) {
				this.timeline.to(object.material, 3, {
					'opacity': 1,
					ease: Expo.easeOut,
					onComplete: () => {
						object.material.transparent = false;
					}
				}, '0');
				this.timeline.fromTo(object.mesh.scale, 3,
					{ 'x': 0.6, y: '0.8', z: '0.8', ease: Expo.easeOut },
					{ 'x': 1.2, y: '1.2', z: '1.2', ease: Expo.easeOut },
					'0');
				this.timeline.from(object.mesh.rotation, 3, { 'y': NumberUtils.toRadians(-10) }, '0');
			}
		});
	}

	playEndZoneSound(id) {
		TweenMax.delayedCall(3, () => {
			SoundManager.play(this.soundsEndZone[id]);
		});
	}

	startHoverAnimation() {
		this.hoverTl.play();
	}

	endHoverAnimation() {
		this.hoverTl.reverse();
	}

	addToGUI(gui) {
		this.children.forEach(object => {
			let folder = gui.addFolder(object.name);

			folder.add(object.position, 'x', -50, 50).name('posx');
			folder.add(object.position, 'y', -10, 10).name('posy');
			folder.add(object.position, 'z', -50, 50).name('posz');

			folder.add(object.scale, 'x', 0, 2).name('scale').onChange((scale) => {
				object.scale.x = object.scale.y = object.scale.z = scale;
			});

			let params = {
				'x': NumberUtils.toDegree(object.rotation.x),
				'y': NumberUtils.toDegree(object.rotation.y),
				'z': NumberUtils.toDegree(object.rotation.z)
			};

			folder.add(params, 'x', 0, 360).name('rotationx').onChange((degValue) => {
				let angle = NumberUtils.toRadians(degValue);
				object.rotation.x = angle;
			});
			folder.add(params, 'y', 0, 360).name('rotationy').onChange((degValue) => {
				let angle = NumberUtils.toRadians(degValue);
				object.rotation.y = angle;
			});
			folder.add(params, 'z', 0, 360).name('rotationz').onChange((degValue) => {
				let angle = NumberUtils.toRadians(degValue);
				object.rotation.z = angle;
			});
		});
	}

	update() {
		if(this.animate) {
			this.children.forEach(object => {
				if(object.options.materialize) {
					object.material.uniforms.time.value = this.splineAnimationTime.time;
				}
			});
		}

		if(this.animateSpline) {
			const time = this.splineAnimationTime.time;
			let previousCameraPosition = this.spline.curve.getPoint(time >= 0.01 ? time - 0.01 : time);

			let cameraPosition = this.spline.curve.getPoint(this.splineAnimationTime.time);

			let vector = {
				x: this.spline.target.x - cameraPosition.x,
				z: this.spline.target.z - cameraPosition.z
			};

			let angle = Math.atan2(vector.x, vector.z);

			this.controlsContainer.position.z = cameraPosition.z;
			this.controlsContainer.position.x = cameraPosition.x;
			this.controlsContainer.position.y = cameraPosition.y;

			this.controlsContainer.translateZ(cameraPosition.z - previousCameraPosition.z);
			this.controlsContainer.translateX(cameraPosition.x - previousCameraPosition.x);
			this.controlsContainer.translateY(cameraPosition.y - previousCameraPosition.y);

			this.controlsContainer.rotation.y = angle;
		}
	}
}

export default Zone;
