import VertexShader from '../shaders/ModelObject/shader.vert';

import * as NumberUtils from '../utils/NumberUtils';

class ModelObject {
	constructor(mesh, options = {}) {
		this.name = options.name;
		this.options = options;
		this.options.color = this.options.color ? this.options.color : 0xcacaca;
		this.options.materialize = this.options.materialize ? this.options.materialize : false;
		this.mesh = mesh;

		for (let i = 0; i < this.mesh.children.length; i++) {
			this.mesh.name = this.name;
		}

		this.geometry = this.mesh.geometry;

		this.createMesh();
	}

	createMesh() {
		if(this.options.materialize) {
			this.geometryObj = new THREE.Geometry().fromBufferGeometry(this.geometry);
			this.modifyGeometry();
			this.createRandomAttributes();
			this.createMaterial();
		} else {
			this.material = new THREE.MeshPhongMaterial({
				color: this.options.color,
				lights: true,
				fog: true,
				transparent: true,
				opacity: this.options.opacity ? this.options.opacity : 0
			});
		}

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		if(this.options.x) this.mesh.position.x = this.options.x;
		if(this.options.y) this.mesh.position.y = this.options.y;
		if(this.options.z) this.mesh.position.z = this.options.z;
		if(this.options.rotx) this.mesh.rotation.x = NumberUtils.toRadians(this.options.rotx);
		if(this.options.roty) this.mesh.rotation.y = NumberUtils.toRadians(this.options.roty);
		if(this.options.rotz) this.mesh.rotation.z = NumberUtils.toRadians(this.options.rotz);
		if(this.options.scale) this.mesh.scale.set(this.options.scale, this.options.scale, this.options.scale);

		this.mesh.name = this.name;
	}

	createMaterial() {
		let phongShader = THREE.ShaderLib.phong;
		let uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);

		uniforms.type = 'MeshPhongMaterial';
		uniforms.time = { type: 'f', value: 0 };
		uniforms.diffuse.value = new THREE.Color(this.options.color);
		uniforms.opacity.value = 0;

		// Create our vertex/fragment shaders
		this.material = new THREE.ShaderMaterial({
			vertexShader: VertexShader,
			fragmentShader: phongShader.fragmentShader,
			uniforms: uniforms,
			transparent: true,
			lights: true,
			fog: true
		});
	}

	createRandomAttributes() {
		let values = [];
		let delais = [];

		let random = Math.random();
		let randomDelai = Math.random();

		for (let v = 0, j = 0; v < this.geometry.attributes.position.count; v++) {
			values.push(random * 7);
			delais.push(randomDelai);
			j++;
			if(j > 2) {
				j = 0;
				random = Math.random();
				randomDelai = Math.random();
			}
		}

		let typedArray = Float32Array.from(values);
		let typedArray2 = Float32Array.from(delais);

		this.geometry.addAttribute('random', new THREE.BufferAttribute(typedArray, 1));
		this.geometry.addAttribute('delai', new THREE.BufferAttribute(typedArray2, 1));
	}

	modifyGeometry() {
		let tessellateModifier = new THREE.TessellateModifier(8);
		for (let i = 0; i < 6; i++) {
			tessellateModifier.modify(this.geometryObj);
		}
		let explodeModifier = new THREE.ExplodeModifier();
		explodeModifier.modify(this.geometryObj);
		let numFaces = this.geometryObj.faces.length;

		this.geometry = new THREE.BufferGeometry().fromGeometry(this.geometryObj);

		let displacement = new Float32Array(numFaces * 3 * 3);

		for (let f = 0; f < numFaces; f++) {
			let index = 9 * f;
			let d = 10 * (0.5 - Math.random());
			for (let i = 0; i < 3; i++) {
				displacement[index + (3 * i)] = d;
				displacement[index + (3 * i) + 1] = d;
				displacement[index + (3 * i) + 2] = d;
			}
		}
		this.geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 3));
	}
}

export default ModelObject;
