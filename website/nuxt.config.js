const configFile = require('./config.json');

let config;
if(process.env.NODE_ENV == 'production') {
	config = configFile.prod;
} else {
	config = configFile.prev;
}

const path = require('path');
let FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const webpack = require('webpack')

module.exports = {
	/*
	** Headers of the page
	*/
	env: {
		URL: config.URL,
		SLUG: config.slug,
		__PROD__: process.env.NODE_ENV == 'production'
	},
	head: {
		title: 'Spill.net project',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Nausea' },
			{ name: 'theme-color', content: '#f9f4ef' },
			{ name: 'twitter:card', content: 'Nausea' },
			{ name: 'twitter:site', content: config.URL },
			{ name: 'og:url', content: config.URL },
			{ name: 'og:title', content: 'Nausea' },
			{ name: 'og:image', content: config.URL + '/background.jpg' },
			{ name: 'og:description', content: '...' }
		],
		link: [
			{ rel: 'manifest', href: '/manifest.json' },
			{ rel: 'mask-icon', color: '#f9f4ef', href: '/safari-pinned-tab.svg' }
		]
	},
	css: [
		'~assets/scss/main.scss',
		'~assets/scss/fonts.scss',
		'normalize.css'
	],
	modules: [
		// ['@nuxtjs/google-analytics', { ua: 'UA-XXXXXXXX-X' }],
	],
	/*
	** Customize the progress-bar color
	*/
	loading: { color: '#000000' },
	/*
	** Build configuration
	*/
	build: {
		/*
		** Run ESLINT on save
		*/
		extend(config, ctx) {
			config.resolve.alias['~core'] = path.resolve(__dirname, 'core/');

			if (ctx.isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				});
			}

			config.module.rules.push({
				test: /\.svg$/, loader: 'svg-inline-loader', exclude: /node_modules/
			});

			config.module.rules.push({
				test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/
			});

			config.module.rules.push({
				test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/
			});
		},
		plugins: [
			new FaviconsWebpackPlugin('static/images/logo_sm.png'),
			new webpack.ProvidePlugin({
				'THREE': 'three'
			})
		],
		vendor: [
			'gsap',
			'three',
			'three/examples/js/modifiers/TessellateModifier',
			'three/examples/js/modifiers/ExplodeModifier'
		]
	}
};
