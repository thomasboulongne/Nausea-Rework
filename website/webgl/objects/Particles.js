import TextureLoader from '../utils/TextureLoader';
import VertexShader from '../shaders/Particles/vert.glsl';
import FragmentShader from '../shaders/Particles/frag.glsl';

class Particles {
	constructor(particleTexture = 'particle', particlesNumber = 500, position) {
		this.particleTexture = particleTexture;

		if(this.position) {
			this.position = {
				x: position.x ? position.x : 50,
				y: position.y ? position.y : 25,
				z: position.z ? position.z : 50
			};
		} else {
			this.position = {
				x: 50,
				y: 25,
				z: 50
			};
		}

		this.verticesNumber = particlesNumber;

		this.vertices = [];

		for (let i = 0; i < this.verticesNumber; i++) {
			this.vertices.push(Math.random() * this.position.x - (this.position.x / 2));
			this.vertices.push(Math.random() * this.position.y);
			this.vertices.push(Math.random() * this.position.z - (this.position.z / 2));
		}

		this.verticesAttribute = Float32Array.from(this.vertices);

		this.oldTime = Date.now();
	}

	load() {
		return new Promise(resolve => {
			TextureLoader.load('./assets2d/' + this.particleTexture + '.png', texture => {
				this.uniformsParticles = {

					color: {type: 'c', value: new THREE.Color(0x999999)},
					texture: {type: 't', value: texture},
					globalTime:	{type: 'f', value: 0.0},
					bass: {type: 'f', value: 1.0},
					scale: {type: 'f', value: window.innerHeight * 0.04}
				};

				let shaderMaterial = new THREE.ShaderMaterial({
					uniforms: this.uniformsParticles,
					vertexShader: VertexShader,
					fragmentShader: FragmentShader,
					// blending: 		THREE.AdditiveBlending,
					transparent: true
				});

				this.bufferGeometry = new THREE.BufferGeometry();

				let vertices = this.vertices;
				let valuesSize = [];
				let valuesTime = [];

				for (let v = 0; v < vertices.length; v++) {
					valuesTime[ v ] = Math.random();
					valuesSize[ v ] = 1.0 + Math.random() * 2;
				}

				valuesSize = Float32Array.from(valuesSize);
				valuesTime = Float32Array.from(valuesTime);

				this.bufferGeometry.addAttribute('size', new THREE.BufferAttribute(valuesSize, 1));
				this.bufferGeometry.addAttribute('time', new THREE.BufferAttribute(valuesTime, 1));
				this.bufferGeometry.addAttribute('position', new THREE.BufferAttribute(this.verticesAttribute, 3));

				this.mesh = new THREE.Points(this.bufferGeometry, shaderMaterial);

				resolve('success');
			});
		});
	}

	update() {
		let time = Date.now();
		let delta = time - this.oldTime;
		this.oldTime = time;
		if(this.uniformsParticles) {
			this.uniformsParticles.globalTime.value += delta * 0.0012;
		}
	}
}

export default Particles;
