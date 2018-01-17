import Zone from './Zone';

import ModelObject from '../objects/ModelObject';

import Spline from '../objects/Spline';

import DataEmitter from '../objects/DataEmitter';

import * as NumberUtils from '../utils/NumberUtils';

import SoundManager from '~/core/SoundManager';

class Zone4 extends Zone {

	init() {
		return new Promise(resolve => {
			const objs = [
				new ModelObject(this.Store.getters.object('fountain'), {
					'name': 'fountain',
					'x': 17,
					'y': 0.35,
					'z': 6.2,
					'scale': 1,
					'rotate': true,
					'rotx': 0,
					'roty': 0,
					'rotz': 0,
					'materialize': true
				}),
				new ModelObject(this.Store.getters.object('bench'), {
					'name': 'bench1-z4',
					'x': 14,
					'y': 0,
					'z': 1.8,
					'scale': 1,
					'rotate': false,
					'rotx': 0,
					'roty': 278,
					'rotz': 0,
					'materialize': true
				}),
				new ModelObject(this.Store.getters.object('bench'), {
					'name': 'bench2-z4',
					'x': 13,
					'y': 0,
					'z': 4.8,
					'scale': 1,
					'rotate': false,
					'rotx': 0,
					'roty': 345,
					'rotz': 0,
					'materialize': true
				}),
				new ModelObject(this.Store.getters.object('bench'), {
					'name': 'bench3-z4',
					'x': 12,
					'y': 0,
					'z': 7.3,
					'scale': 1,
					'rotate': false,
					'rotx': 0,
					'roty': 44,
					'rotz': 0,
					'materialize': true
				}),
				new ModelObject(this.Store.getters.object('bench'), {
					'name': 'bench4-z4',
					'x': 22,
					'y': 0,
					'z': 3.5,
					'scale': 1,
					'rotate': false,
					'rotx': 0,
					'roty': 234,
					'rotz': 0,
					'materialize': true
				}),
				new ModelObject(this.Store.getters.object('streetLamp'), {
					'name': 'streetLamp1-z4',
					'x': 17,
					'y': 0,
					'z': 10,
					'scale': 1,
					'rotate': true,
					'rotx': 0,
					'roty': 0,
					'rotz': 0
				}),
				new ModelObject(this.Store.getters.object('streetLamp'), {
					'name': 'streetLamp2-z4',
					'x': 13,
					'y': 0,
					'z': 3,
					'scale': 1,
					'rotate': true,
					'rotx': 0,
					'roty': 0,
					'rotz': 0
				}),
				new ModelObject(this.Store.getters.object('streetLamp'), {
					'name': 'streetLamp3-z4',
					'x': 12,
					'y': 0,
					'z': 6.2,
					'scale': 1,
					'rotate': true,
					'rotx': 0,
					'roty': 0,
					'rotz': 0
				}),
				new ModelObject(this.Store.getters.object('streetLamp'), {
					'name': 'streetLamp4-z4',
					'x': 20.6,
					'y': 0,
					'z': 1.8,
					'scale': 1,
					'rotate': true,
					'rotx': 0,
					'roty': 0,
					'rotz': 0
				})
			];
			super.init(objs);

			this.sound = SoundManager.get(this.soundId).volume(3);

			this.datas = new DataEmitter(this.controlsContainer, ['fountain1', 'fountain2'], {
				x: 17,
				y: 2,
				z: 6,
				particles: 30,
				side: 3.5,
				minDistance: 1.15
			});

			this.initSpline();
			resolve();
		});
	}

	playAnim(nb) {
		super.playAnim(nb);
		let fountain = this.objects[0].mesh;
		this.timeline.from(fountain.scale, 10, {'x': 0.8, 'y': 0.8, z: '0.8', ease: Expo.easeOut}, '0');
		this.timeline.from(fountain.rotation, 10, {'y': NumberUtils.toRadians(-205), ease: Expo.easeOut}, '0');

		this.playSound();
	}

	/**
	 * @Spline
	 */
	initSpline() {
		this.splinePoints = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(5, 0.5, 2),
			new THREE.Vector3(10, 0.75, 5),
			new THREE.Vector3(12, 0.65, 7),
			new THREE.Vector3(14, 0.75, 9),
			new THREE.Vector3(20, 1.8, 12),
			new THREE.Vector3(21, 1.3, 11)
		];
		this.spline = new Spline(this.objects[0].mesh.position, this.controlsContainer, this.zoomParams, this.splinePoints, this.id);
		this.spline.init();
	}
}

export default Zone4;
