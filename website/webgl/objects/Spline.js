import Config from '~/config.json';

class Spline {
	constructor(target, zoomParams, points) {
		this.target = target;
		this.zoomParams = zoomParams;

		this.count = 0;
		this.amount = 0.001;
		this.ratio = 100;

		this.enabled = false;

		this.points = points;

		this.curve = new THREE.CatmullRomCurve3(this.points);

		if(Config.gl.debug) {
			this.createGeometry();
		}
	}

	createGeometry() {
		this.geometry = new THREE.Geometry();
		this.geometry.vertices = this.curve.getPoints(50);
		this.material = new THREE.LineBasicMaterial({
			color: 0xFF0000
		});

		this.line = new THREE.Line(this.geometry, this.material);
		this.add(this.spline.line);
	}
}

export default Spline;
