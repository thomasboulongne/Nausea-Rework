import { EffectComposer, RenderPass } from 'postprocessing';

import './utils/PointerLockControls';
import Config from '~/config.json';

import Field from './objects/Field';
import Particles from './objects/Particles';
import Skybox from './objects/Skybox';

import SoundManager from '~/core/SoundManager';

import Lights from './lights/Lights';

import WebglCursor from './utils/WebglCursor';

import Zone0 from './zones/Zone0';
import Zone1 from './zones/Zone1';
import Zone2 from './zones/Zone2';
import Zone3 from './zones/Zone3';
import Zone4 from './zones/Zone4';

class ExperienceScene {
	constructor(domElement, Store) {
		if(Config.gl.gui) {
			const Dat = require('dat-gui');
			this.gui = new Dat.GUI();
		}

		this.domElement = domElement;

		this.Store = Store;

		this.INTERSECTED = null;

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.scene = new THREE.Scene();

		// this.add(new THREE.AxisHelper(8));

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xffffff);

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);

		this.scene.fog = new THREE.FogExp2(0xffffff, 0.08);
		if(Config.gl.gui) this.gui.add(this.scene.fog, 'density', 0, 0.2).name('fog');

		this.Store.dispatch('disableRaycast');

		this.setControls();

		this.setLights();

		this.setComposer();

		this.setAmbiantSound();

		this.createObjects();

		this.createZones();

		this.addEventListeners();
	}

	add(child) {
		this.scene.add(child);
	}

	remove(child) {
		this.scene.remove(child);
	}

	setControls() {
		this.center = new THREE.Vector3();

		let controlsPosition = {
			z: 0,
			y: 1,
			x: 0
		};

		this.controls = new THREE.PointerLockControls(this.camera, controlsPosition, this.center, 0.01);
		this.controlsContainer = new THREE.Object3D();
		this.controlsContainer.add(this.controls.getObject());
		this.add(this.controlsContainer);
	}

	setLights() {
		this.lights = new Lights();
		for (let i = 0; i < this.lights.list.length; i++) {
			this.add(this.lights.list[i]);
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

	setAmbiantSound() {
		SoundManager.play('atmos01');
	}

	createObjects() {
		this.field = new Field();

		this.particles = new Particles('particle', 500);

		this.whiteSkybox = new Skybox('assets2d/skybox/');
		this.blackSkybox = new Skybox('assets2d/homeSkybox/');

		Promise.all([
			this.whiteSkybox.load(),
			this.blackSkybox.load(),
			this.field.load(),
			this.particles.load()
		])
		.then(() => {
			this.scene.background = this.whiteSkybox.texture;
			this.add(this.field.mesh);
			this.add(this.particles.mesh);
		});
	}

	createZones() {
		this.zones = [
			new Zone0(this.Store, {number: 0}),
			new Zone1(this.Store, {controlsContainer: this.controlsContainer, orientation: { x: [882, 1059], y: [541, 674] }, zoomParams: { strength: 0.0025 }, name: 'Le Maronnier', number: 1, soundId: '03'}),
			new Zone2(this.Store, {controlsContainer: this.controlsContainer, orientation: { x: [1407, 1640], y: [555, 696] }, zoomParams: { strength: 0.0025 }, name: 'Le Kiosque', number: 2, soundId: '06'}),
			new Zone3(this.Store, {controlsContainer: this.controlsContainer, orientation: { x: [132, 252], y: [553, 677] }, zoomParams: { strength: 0.0025 }, name: 'La Statue', number: 3, soundId: '05'}),
			new Zone4(this.Store, {controlsContainer: this.controlsContainer, orientation: { x: [459, 552], y: [592, 677] }, zoomParams: { strength: 0.0025 }, name: 'La Fontaine', number: 4, soundId: '07'})
		];

		this.zones.forEach(zone => {
			this.add(zone);
		});

		this.intro();
	}

	intro() {
		let cameraTl = new TimelineLite();

		cameraTl
		.add(() => {
			SoundManager.play('02');
		}, '+=4')
		// .to(this.passes[1].params, 4, {
		// 	delay: 2,
		// 	boost: 1
		// })
		.to(this.controls.pitchObject.rotation, 10, {
			x: 0.1,
			ease: Power1.easeInOut,
			onComplete: () => {
				this.controls.enabled = true;
				this.Store.dispatch('enableRaycast');
				this.cursor = new WebglCursor(this.domElement, { color: '#4a4a4a' });
				this.Store.dispatch('showExpTooltip');
			}
		}, '-=2')
		.add(() => {
			this.Store.dispatch('updateWebglExpState', 'afterIntro');
		}, '-=1.5');

		this.zones[0].rootsTl.play();
	}

	outro() {
		let tl = new TimelineMax();

		tl.add(() => {
			this.endLights = true;
		}, '2')
		// .to(this.passes[2].params, 20, {
		// 	strength: 0.2
		// }, '3')
		.to(this.camera, 20, {
			fov: 20
		}, '3')
		.add(() => {
			SoundManager.play('10');
		}, '3')
		.add(() => {
			SoundManager.play('16');
		}, '22')
		.add(() => {
			SoundManager.play('11');
		}, '41')
		.add(() => {
			SoundManager.play('13');
		}, '46')
		.add(() => {
			// Emitter.emit('END_SCREEN');
			this.scene.background = this.blackSkybox.texture;
		}, '46');
	}

	addEventListeners() {
		window.addEventListener('resize', this.onResize.bind(this));
		TweenMax.ticker.addEventListener('tick', this.render.bind(this));
		this.Store.watch((state, getters) => getters.exp.cursor.animated, animated => {
			if(animated) {
				this.cursor.onMouseEnter()
				.then(() => {
					this.onEnterZone();
				})
				.catch(() => {});
			} else {
				this.cursor.onMouseLeave();
			}
		});

		this.Store.watch((state, getters) => getters.exp.raycast.zone, zoneNumber => {
			if(zoneNumber != null && this.Store.getters.exp.raycast.enabled) {
				setTimeout(() => this.Store.dispatch('hideExpTooltip'), 500);
			} else {
				this.Store.dispatch('endExpCursorAnimation');
			}
		});

		window.addEventListener('keydown', this.toggleCamera.bind(this));
	}

	toggleCamera(event) {
		if(event != undefined || event.keyCode === 27) {
			this.controls.enabled = !this.controls.enabled;
		}
	}

	addCanvasElement(domElt) {
		this.canvasElement = domElt;
	}

	onEnterZone() {
		this.Store.dispatch('startZoneAnimation');
		this.Store.dispatch('endExpCursorAnimation');
		TweenMax.to(this.scene.fog, 1, { density: 0.12, delay: 1 });
	}

	onLeaveZone(idZone) {
		this.countZones++;

		TweenMax.to(this.scene.fog, 1, { density: 0.12 - idZone / 100 });

		switch(this.countZones) {
			case 1:
				TweenMax.delayedCall(3, () => {
					SoundManager.play('04');
				});
				break;
			case 2:
				SoundManager.play('atmos02');
				break;
			case 3:
				SoundManager.play('atmos05');
				break;
			case 4:
				this.outro();
				SoundManager.play('atmos06');
				break;
			default:
				break;
		}

		TweenMax.to(this.scene.fog, 1, { density: 0.08 });
	}

	render() {
		if(this.zones) {
			let mouse = this.controls.mouse;
			let raycastedZone = null;
			this.zones.forEach(zone => {
				zone.update();
				if(
					mouse.x > window.innerWidth * zone.orientation.x[0] / 1706 &&
					mouse.x < window.innerWidth * zone.orientation.x[1] / 1706 &&
					mouse.y > window.innerHeight * zone.orientation.y[0] / 1299 &&
					mouse.y < window.innerHeight * zone.orientation.y[1] / 1299
				) {
					raycastedZone = zone.number;
				}
			});

			this.Store.dispatch('updateRaycastZone', raycastedZone);
		}

		this.renderer.autoClearColor = true;

		this.composer.render(this.clock.getDelta());

		if(this.canvasElement) {
			this.canvasElement.style.opacity = 1;
		}
	}

	onResize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.width, this.height);
	}
}

export default ExperienceScene;
