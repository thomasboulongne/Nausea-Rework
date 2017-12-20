export function map(num, min1, max1, min2, max2) {
	let num1 = (num - min1) / (max1 - min1);
	let num2 = (num1 * (max2 - min2)) + min2;

	return num2;
}

export function hex2rgb(hex) {
	hex = (hex.substr(0, 1) == '#') ? hex.substr(1) : hex;
	return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
}

export function toRadians(degree) {
	return degree * (Math.PI / 180);
}

export function toDegree(radians) {
	return radians * (180 / Math.PI);
}

export function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
