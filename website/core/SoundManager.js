import Howler from 'howler';

class Manager {
	constructor() {
		let soundsToLoad = [
			{
				'name': '01',
				'file': '01-exister',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '02',
				'file': '02-jardinpublic',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '03',
				'file': '03-assis',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '04',
				'file': '04-cache',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '05',
				'file': '05-la',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '06',
				'file': '06-decor',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '07',
				'file': '07-devoilee',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '08',
				'file': '08-existants',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '09',
				'file': '09-trop',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '10',
				'file': '10-debordait',
				'options': {
					'volume': 2,
					'loop': false
				}
			},
			{
				'name': '11',
				'file': '11-trop',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '12',
				'file': '12-moi',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '13',
				'file': '13-eternite',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '14',
				'file': '14-objets',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '15',
				'file': '15-boursouflure',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '16',
				'file': '16-aller',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': '17',
				'file': '17-cadavre',
				'options': {
					'volume': 3,
					'loop': false
				}
			},
			{
				'name': 'atmos01',
				'file': 'atmos01',
				'options': {
					'volume': 0.75,
					'loop': true
				}
			},
			{
				'name': 'atmos02',
				'file': 'atmos02',
				'options': {
					'volume': 0.75,
					'loop': true
				}
			},
			{
				'name': 'atmos05',
				'file': 'atmos05',
				'options': {
					'volume': 0.75,
					'loop': true
				}
			},
			{
				'name': 'atmos06',
				'file': 'atmos06',
				'options': {
					'volume': 0.75,
					'loop': true
				}
			},
			{
				'name': 'back',
				'file': 'back',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'enter',
				'file': 'Enter',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'hover',
				'file': 'Hover',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'hover_button',
				'file': 'hover_button',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'materialize',
				'file': 'materialize',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'progressbar',
				'file': 'ProgressBar',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'progressioncomplete',
				'file': 'ProgressionComplete',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'tip',
				'file': 'tip',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'out',
				'file': 'out',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'tick',
				'file': 'tick',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'complete',
				'file': 'complete',
				'options': {
					'volume': 1,
					'loop': false
				}
			},
			{
				'name': 'transition_page',
				'file': 'transition_page',
				'options': {
					'volume': 1,
					'loop': false
				}
			}
		];

		this.sounds = {};

		for (let i = 0; i < soundsToLoad.length; i++) {
			this.sounds[soundsToLoad[i].name] = this.load(soundsToLoad[i].file, soundsToLoad[i].options);
		}
	}

	load(name, options = {}) {
		let sound = new Howler.Howl({
			src: ['sound/' + name + '.mp3'],
			loop: options.loop ? options.loop : false,
			volume: options.volume ? options.volume : 1
		});

		return sound;
	}

	get(sound) {
		return this.sounds[sound];
	}

	play(sound) {
		this.sounds[sound].play();
	}
}

const SoundManager = new Manager();

export default SoundManager;
