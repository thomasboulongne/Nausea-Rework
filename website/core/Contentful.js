import markdown from './Markdown';
import CookiesServ from 'cookie';
import CookiesClient from 'js-cookie';
import acceptLanguage from 'accept-language';

import { contentfulClient } from './ContentfulConfig';

export const getPages = function(Store) {
	return contentfulClient.getEntries({
		content_type: ''
	})
	.then(response => {
		for (let i = 0; i < response.items.length; i++) {
			const page = response.items[i].fields;

			page.body = markdown.render(page.body);

			Store.dispatch('addPage', page);
		}

		return new Promise(resolve => { resolve(Store.getters.pages); });
	});
};

export const getTranslations = function(Store, locale) {
	return contentfulClient.getEntries({
		content_type: 'translation',
		locale: locale
	})
	.then(response => {
		response.items.forEach(item => {
			Store.dispatch('addTranslation', item.fields);
		});
		return new Promise(resolve => { resolve(Store.getters.translations); });
	});
};

export const getAll = function(store, isServer, req, res) {
	let locale = 'en-US';

	if(isServer) {
		acceptLanguage.languages(['en-US', 'fr-FR']);
		locale = acceptLanguage.get(req.headers['accept-language']);

		if(req.headers.cookie) {
			const cookies = CookiesServ.parse(req.headers.cookie);

			if(cookies[process.env.SLUG + '_lang']) {
				locale = cookies[process.env.SLUG + '_lang'];
			}
		}

		res.setHeader('Set-Cookie', CookiesServ.serialize(process.env.SLUG + '_lang', locale));
	} else {
		locale = CookiesClient.get(process.env.SLUG + '_lang') ? CookiesClient.get(process.env.SLUG + '_lang') : navigator.language;
	}

	store.dispatch('setLang', locale);

	if(!store.getters.loaded) {
		let promises = [
			getPages(store, locale),
			getTranslations(store, locale)
		];
		return Promise.all(promises).then(() => {
			store.dispatch('hasLoaded');
		});
	} else {
		return new Promise(resolve => resolve());
	}
};
