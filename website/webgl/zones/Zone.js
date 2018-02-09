import SoundManager from '~/core/SoundManager';

import * as NumberUtils from '../utils/NumberUtils';

class Zone extends THREE.Group {
	constructor(Store, {controlsContainer, orientation = { x: [0, 0], y: [0, 0] }, zoomParams = {strength: 0.0025}, name = '', number = 0, soundId = 0}) {
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

		this.addEventListeners();

		this.Store.dispatch('addZone', {name: name, number: number});
	}

	addEventListeners() {
		this.Store.watch((state, getters) => getters.exp.zones, zones => {
			const zone = zones.find(zone => zone.animated == true);
		});
	}

	addObjects() {
		throw new Error('addObjects is not implemented in this zone');
	}

	initHoverTimeline() {
		this.hoverTl = new TimelineMax({ paused: true });

		this.children.forEach(object => {
			if(object.material.fragmentShader) {
				this.hoverTl.to(object.material.uniforms.opacity, 3.1, { value: 1 }, 0);
				if(object.options.rotate) {
					this.hoverTl.to(object.mesh.rotation, 3.1, { y: NumberUtils.toRadians(10), ease: Circ.easeInOut }, 0);
				}
			}
		});
	}

	initTimeline() {
		this.animate = true;
		this.initHoverTimeline();
		this.tweenTime = { time: 0 };
		this.timeline = new TimelineMax({ paused: true });
		this.timeline.to(this.tweenTime, 7, {
			time: 2,
			ease: Circ.easeOut,
			onReverseComplete: () => {
				this.Store.dispatch('endZoneAnimation', this.number);
			}
		}, '1');
	}

	playTimeline() {
		this.timeline.play();
	}

	playAnim() {
		this.Store.dispatch('startZoneAnimation', this.number);
		this.animated = true;
		this.children.forEach(obj => {
			obj.material.transparent = false;
		});

		this.zoomParams.strength = 0.020;

		TweenMax.delayedCall(2, () => {
			this.spline.enableSpline();
		});

		console.log('Sound: ', SoundManager.get(this.soundId));

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

		SoundManager.play('materialize');
	}

	playEndZoneSound(id) {
		TweenMax.delayedCall(3, () => {
			SoundManager.play(this.soundsEndZone[id]);
		});
	}

	playSound() {
		SoundManager.play(this.soundId);
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
					object.material.uniforms.time.value = this.tweenTime.time;
				}
			});
		}

		if(this.datas) {
			this.datas.update();
		}

		if(this.spline) {
			this.spline.update();
		}
	}
}

export default Zone;
