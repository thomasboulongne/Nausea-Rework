import Zone from './Zone';

import ModelObject from '../objects/ModelObject';
import ChromaKeyPlane from '../objects/ChromaKeyPlane';

import Spline from '../objects/Spline';

import DataEmitter from '../objects/DataEmitter';

import * as NumberUtils from '../utils/NumberUtils';

import SoundManager from '~/core/SoundManager';

class Zone2 extends Zone {
	addObjects() {
		const objects = [
			new ModelObject(this.Store.getters.object('stand'), {
				'name': 'stand',
				'x': -16,
				'y': -0.2,
				'z': 0,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 349,
				'rotz': 0,
				'materialize': true
			}),
			new ModelObject(this.Store.getters.object('chestnut'), {
				'name': 'chestnut1-z2',
				'x': -17,
				'y': 0,
				'z': 5,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 260,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('streetLamp'), {
				'name': 'streetLamp1-z2',
				'x': -9,
				'y': 0,
				'z': 0.7,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('streetLamp'), {
				'name': 'streetLamp2-z2',
				'x': -12,
				'y': 0,
				'z': 3,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('streetLamp'), {
				'name': 'streetLamp3-z2',
				'x': -15,
				'y': 0,
				'z': 5.7,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('streetLamp'), {
				'name': 'streetLamp4-z2',
				'x': -17,
				'y': 0,
				'z': 8.5,
				'scale': 1,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('shrub'), {
				'name': 'shrub1-z2',
				'x': -16,
				'y': 0,
				'z': -4.9,
				'scale': 0.6,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ModelObject(this.Store.getters.object('shrub'), {
				'name': 'shrub2-z2',
				'x': -15,
				'y': 0,
				'z': -6,
				'scale': 0.7,
				'rotate': true,
				'rotx': 0,
				'roty': 0,
				'rotz': 0
			}),
			new ChromaKeyPlane('couple', {
				'r': 1,
				'g': 1,
				'b': 1,
				'x': -13,
				'y': 1.4,
				'z': -0.3,
				'rotY': 1,
				'opacity': 0
			})
		];

		this.sound = SoundManager.get(this.soundId).volume(4);

		this.datas = new DataEmitter(this.controlsContainer, ['stand1', 'stand2', 'stand3'], {
			x: -16,
			y: 2.5,
			z: 0,
			particles: 30,
			side: 3.5,
			minDistance: 1.15
		});

		objects.forEach(object => {
			this.add(object.mesh);
		});

		this.initSpline();
	}

	playAnim(nb) {
		super.playAnim(nb);
		let stand = this.children[0];
		this.timeline.from(stand.scale, 10, { 'x': 0.8, 'y': 0.8, z: '0.8', ease: Expo.easeOut }, '0');
		this.timeline.from(stand.rotation, 10, { 'y': NumberUtils.toRadians(-205), ease: Expo.easeOut }, '0');

		TweenMax.delayedCall(3.5, () => {
			this.playSound();
		});
	}

	initSpline() {
		this.splinePoints = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(-4, 0.5, 0),
			new THREE.Vector3(-10, 1, 0),
			new THREE.Vector3(-14, 1.5, -3),
			new THREE.Vector3(-18, 1.5, -6),
			new THREE.Vector3(-20, 1.5, 0)
		];
		this.spline = new Spline(this.children[0].position, this.controlsContainer, this.zoomParams, this.splinePoints, this.id);
		this.spline.init();
	}
}

export default Zone2;
