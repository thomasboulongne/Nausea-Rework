import { EffectComposer, RenderPass } from 'postprocessing';
// import NoisePass from '@superguigui/wagner/src/passes/noise/noise';
// import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';

import './utils/PointerLockControls';

import WebglCursor from './utils/WebglCursor';

import Field from './objects/Field';
import HomeTitle from './objects/HomeTitle';
import Particles from './objects/Particles';
import Skybox from './objects/Skybox';

import SoundManager from '~/core/SoundManager';

import Lights from './lights/Lights';
import HomeLights from './lights/HomeLights';

import { throttle } from 'lodash';

import ModelObject from './objects/ModelObject';

class HomeScene {
	constructor(domElement, Store) {
		this.domElement = domElement;
		this.Store = Store;

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.environmentColor = 0x2a2a2a;

		this.halfWidth = this.width / 2;
		this.halfHeight = this.height / 2;

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(this.environmentColor);

		this.mousePosition = {
			x: this.halfWidth,
			y: this.halfHeight
		};

		this.center = new THREE.Vector3(0, 1, 0);

		this.cameraPositionInitial = {
			x: -10,
			y: -0.3,
			z: 0
		};

		this.cameraPosition = {
			x: -6,
			y: 1,
			z: 0
		};

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

		this.camera.position.set(this.cameraPositionInitial.x, this.cameraPositionInitial.y, this.cameraPositionInitial.z);

		this.camera.lookAt(this.center);

		this.scene.fog = new THREE.FogExp2(this.environmentColor, 0.1);

		this.setLights();

		this.setComposer();

		this.setRaycast();

		this.setSounds();

		this.createObjects();

		this.addEventListeners();

		this.exitFlag = false;
	}

	destructor() {
		this.removeEventListeners();
		this.scene = null;
	}

	add(child) {
		this.scene.add(child);
	}

	remove(child) {
		this.scene.remove(child);
	}

	setLights() {
		this.lights = new Lights();
		for (let i = 0; i < this.lights.list.length; i++) {
			this.add(this.lights.list[i]);
		}

		this.homeLights = new HomeLights();
		for (let i = 0; i < this.homeLights.lights.length; i++) {
			this.add(this.homeLights.lights[i]);
		}
	}

	setComposer() {
		this.composer = new EffectComposer(this.renderer);

		const renderPass = new RenderPass(this.scene, this.camera);

		renderPass.renderToScreen = true;
		this.composer.addPass(renderPass);

		this.clock = new THREE.Clock();

		// let pass = new SMAAPass(assets.get("smaa-search"), assets.get("smaa-area"));
		// pass.renderToScreen = true;
		// this.smaaPass = pass;
		// composer.addPass(pass);

		// this.passes = [
		// 	new NoisePass({
		// 		amount: 0.05
		// 	}),
		// 	new VignettePass({
		// 		boost: 1,
		// 		reduction: 0.4
		// 	})
		// ];
	}

	setRaycast() {
		this.INTERSECTED = false;

		this.raycastMeshes = [];

		this.raycaster = new THREE.Raycaster();

		this.startRaycast = false;

		this.mouseRaycast = {
			x: this.mousePosition.x,
			y: this.mousePosition.y
		};
	}

	setSounds() {
		this.enableHoverSound = true;
		this.setAmbiantSound();
	}

	setAmbiantSound() {
		SoundManager.play('atmos01');
	}

	createObjects() {
		this.field = new Field();

		this.title = new HomeTitle();

		this.particles = new Particles('particleWhite', 500, {x: 10});

		this.skybox = new Skybox('assets2d/homeSkybox/');

		this.bench = new ModelObject(this.Store.getters.object('sartre_bench_intro'), {
			'name': 'sartre_bench_intro',
			'x': 0,
			'y': -0.22,
			'z': 0,
			'color': 0xcacaca
		});

		Promise.all([
			this.skybox.load(),
			this.field.load(),
			this.particles.load()
		])
		.then(data => {
			this.scene.background = data[0];

			this.add(this.title.mesh);
			this.add(this.bench.mesh);
			this.add(this.field.mesh);
			this.add(this.particles.mesh);

			this.raycastMeshes.push(this.bench.mesh);
		});
	}

	addEventListeners() {
		this.Store.watch((state, getters) => getters.viewportSize, () => {
			this.onResize();
		});

		this.Store.watch((state, getters) => getters.home.state, state => {
			if(state == 'beforeLeave') {
				this.exit();
			}
		});

		this.Store.watch((state, getters) => getters.home.cursor.enabled, cursor => {
			if(cursor) {
				this.cursor = new WebglCursor(this.domElement, this.Store);
				this.enter();
				this.startRaycast = true;
			}
		});

		this.Store.watch((state, getters) => getters.home.cursor.animated, animated => {
			if(animated) {
				this.onMouseEnter();
			} else {
				this.onMouseLeave();
			}
		});

		this.bindRender = this.render.bind(this);
		TweenMax.ticker.addEventListener('tick', this.bindRender);

		this.Store.watch((state, getters) => getters.loaded, () => {
			this.enter();
		});
	}

	removeEventListeners() {
		TweenMax.ticker.removeEventListener('tick', this.bindRender);
		window.removeEventListener('mousemove', this.boundMouseMove);
	}

	toggleCamera() {
		this.controls.enabled = !this.controls.enabled;
	}

	updateCameraPosition(event) {
		throttle(() => {
			this.mouseRaycast.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouseRaycast.y = -(event.clientY / window.innerHeight) * 2 + 1;

			this.mousePosition.x = event.clientX;
			this.mousePosition.y = event.clientY;
			this.percentX = (this.mousePosition.x - this.halfWidth) * 100 / this.halfWidth;
			this.percentY = (this.mousePosition.y - this.halfHeight) * 100 / this.halfHeight;

			TweenLite.to(this.camera.position, 1, {
				y: this.cameraPosition.y + this.percentY * 0.002,
				z: this.cameraPosition.z + this.percentX * 0.006,
				ease: Expo.easeOut
			});
		}, 100)(event);
	}

	onMouseEnter() {
		if(!this.in && this.cursor) {
			this.cursor.onMouseEnter()
			.then(() => {
				this.Store.dispatch('updateWebglHomeState', 'beforeLeave');
				this.Store.dispatch('updateWebglExpDisplay', true);
			})
			.catch(() => {
			});
		}
		this.in = true;
	}

	onMouseLeave() {
		this.in = false;
		if(this.cursor) {
			this.cursor.onMouseLeave();
		}
	}

	enter() {
		let tl = new TimelineLite();
		tl.to(this.camera.position, 2, {
			x: -5.5,
			y: 0,
			z: -0.4,
			ease: Power2.easeIn
		})
		.to(this.camera.position, 2, {
			x: this.cameraPosition.x,
			y: this.cameraPosition.y,
			z: this.cameraPosition.z,
			ease: Power2.easeOut,
			onComplete: () => {
				this.boundMouseMove = event => this.updateCameraPosition(event);
				window.addEventListener('mousemove', this.boundMouseMove);
				this.endStartAnimation = true;
				this.Store.dispatch('updateWebglHomeState', 'afterEnter');
			}
		}, '-=0.5');
	}

	exit() {
		this.startRaycast = false;
		if(!this.exitFlag) {
			SoundManager.play('enter');
			let exitTime = 0.7;
			let tl = new TimelineLite();
			tl.to(this.camera.position, exitTime, {
				x: -0.1,
				y: 0.9,
				z: 0.2,
				ease: Power4.easeIn,
				onComplete: () => {
					this.Store.dispatch('updateWebglHomeState', 'afterLeave');
					this.Store.dispatch('updateWebglHomeDisplay', false);
				}
			}, 0)
			.to(this.center, exitTime, {
				x: -0.1,
				y: 0.9,
				z: 0.2,
				ease: Power4.easeIn
			}, 0)
			// .to(this.passes[1].params, exitTime * 0.7, {
			// 	boost: 7,
			// 	ease: Power4.easeIn
			// }, 0.3)
			;
		}

		this.exitFlag = true;
	}

	render() {
		this.homeLights.update();

		// Particles

		if(this.particles) {
			this.particles.update();
		}

		this.renderer.autoClearColor = true;

		this.camera.lookAt(this.center);

		if(this.startRaycast) {
			this.raycaster.setFromCamera(this.mouseRaycast, this.camera);

			let intersects = this.raycaster.intersectObjects(this.raycastMeshes, true);

			if(intersects.length == 0) {
				if(this.INTERSECTED) {
					this.Store.dispatch('endHomeCursorAnimation');
				}
				this.INTERSECTED = false;
			} else {
				if(!this.INTERSECTED) {
					this.Store.dispatch('startHomeCursorAnimation');
				}
				this.enableHoverSound = true;
				this.INTERSECTED = true;
			}
		}
		this.composer.render(this.clock.getDelta());
	}

	onResize() {
		this.halfWidth = this.width / 2;
		this.halfHeight = this.height / 2;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.width, this.height);
	}
}

export default HomeScene;
