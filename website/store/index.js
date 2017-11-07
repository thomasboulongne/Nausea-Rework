import Vuex from 'vuex';

const store = () => new Vuex.Store({
	state: {
		pages: [],
		objects: {},
		uiData: {
			viewportSize: {
				width: 0,
				height: 0
			},
			scrollPosition: {
				x: 0,
				y: 0
			},
			locale: 'en-US'
		},

		toLoadTotal: 0,

		loadedCount: 0,

		contentLoaded: false,

		translations: []
	},

	mutations: {
		ADD_PAGE(state, page) {
			state.pages.push(page);
		},
		ADD_OBJECT(state, object) {
			state.objects[object.name] = object.obj;
		},
		UPDATE_VIEWPORT_SIZE(state, size) {
			state.uiData.viewportSize = size;
		},
		UPDATE_SCROLL_POSITION(state, position) {
			state.uiData.scrollPosition = position;
		},
		SET_TO_LOAD_TOTAL(state, number) {
			state.toLoadTotal = number;
		},
		UPDATE_LOADED_COUNT(state, count) {
			state.loadedCount = count;
		},
		CONTENT_LOADED(state) {
			state.contentLoaded = true;
		},
		SET_LANG(state, lang) {
			state.uiData.lang = lang;
		},
		ADD_TRANSLATION(state, translation) {
			state.translations.push(translation);
		}
	},

	actions: {
		addPage({ commit }, page) {
			commit('ADD_PAGE', page);
		},
		addObject({ commit }, object) {
			commit('ADD_OBJECT', object);
		},
		updateViewportSize({ commit }, size) {
			commit('UPDATE_VIEWPORT_SIZE', size);
		},
		updateScrollPosition({ commit }, position) {
			commit('UPDATE_SCROLL_POSITION', position);
		},
		setToLoadTotal({ commit }, number) {
			commit('SET_TO_LOAD_TOTAL', number);
		},
		updateLoadedCount({ commit }, count) {
			commit('UPDATE_LOADED_COUNT', count);
		},
		hasLoaded({ commit }) {
			commit('CONTENT_LOADED');
		},
		addTranslation({ commit }, translation) {
			commit('ADD_TRANSLATION', translation);
		},
		setLang({ commit }, lang) {
			commit('SET_LANG', lang);
		}
	},

	getters: {
		project: state => slug => state.pages.find(p => p.slug == slug),
		viewportSize: state => state.uiData.viewportSize,
		scrollPosition: state => state.uiData.scrollPosition,
		loadedPercentage: state => state.toLoadTotal > 0 ? (state.loadedCount / state.toLoadTotal) * 100 : 0,
		loaded: state => state.contentLoaded,
		translation: state => identifier => {
			return state.translations.find(t => t.identifier == identifier) ? state.translations.find(t => t.identifier == identifier).translations : identifier;
		},
		lang: state => state.uiData.lang
	}
});

export default store;
