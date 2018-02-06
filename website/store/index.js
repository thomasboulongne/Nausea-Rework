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

		WebGL: {
			home: {
				displayed: true,
				cursor: {
					enabled: false,
					animated: false,
					completed: false
				},
				state: 'beforeEnter'
			},
			exp: {
				displayed: false,
				animated: null,
				cursor: {
					enabled: false,
					animated: false,
					completed: false
				},
				tooltip: {
					displayed: false,
					text: 'Placez votre curseur sur un élément pour le matérialiser.',
					img: '/images/tip2.gif'
				},
				zones: [],
				raycast: {
					enabled: false,
					zone: null
				},
				state: 'beforeIntro'
			}
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
			state.objects[object.name] = object.mesh;
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
		},
		ENABLE_HOME_CURSOR(state) {
			state.WebGL.home.cursor.enabled = true;
		},
		UPDATE_WEBGL_HOME_STATE(state, homeState) {
			state.WebGL.home.state = homeState;
		},
		UPDATE_WEBGL_HOME_DISPLAY(state, displayed) {
			state.WebGL.home.displayed = displayed;
		},
		ADD_ZONE(state, {zoneName, zoneNumber}) {
			const zone = {
				number: zoneNumber,
				name: zoneName,
				displayed: false,
				animated: false
			};
			state.WebGL.exp.zones.push(zone);
		},
		UPDATE_HOME_CURSOR_ANIMATED(state, animated) {
			state.WebGL.home.cursor.animated = animated;
		},
		UPDATE_WEBGL_EXP_STATE(state, expState) {
			state.WebGL.exp.state = expState;
		},
		UPDATE_WEBGL_EXP_DISPLAY(state, displayed) {
			state.WebGL.exp.displayed = displayed;
		},
		UPDATE_RAYCAST_ENABLE(state, enabled) {
			state.WebGL.exp.raycast.enabled = enabled;
		},
		UPDATE_RAYCAST_ZONE(state, number) {
			state.WebGL.exp.raycast.zone = number;
		},
		UPDATE_EXP_TOOLTIP(state, displayed) {
			state.WebGL.exp.tooltip.displayed = displayed;
		},
		UPDATE_EXP_CURSOR_ANIMATED(state, animated) {
			state.WebGL.exp.cursor.animated = animated;
		},
		START_ZONE_ANIMATION(state, zoneNumber) {
			state.WebGL.exp.animated = zoneNumber;
			state.WebGL.exp.zones.find(zone => zone.number == zoneNumber).animated = true;
		},
		END_ZONE_ANIMATION(state, zoneNumber) {
			state.WebGL.exp.animated = null;
			state.WebGL.exp.zones.find(zone => zone.number == zoneNumber).animated = true;
			state.WebGL.exp.zones.find(zone => zone.number == zoneNumber).displayed = true;
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
		updateLoadedCount({ commit, dispatch }, count) {
			commit('UPDATE_LOADED_COUNT', count);
			dispatch('checkIfFullyLoaded');
		},
		checkIfFullyLoaded({ dispatch, state }) {
			if(state.toLoadTotal == state.loadedCount) {
				dispatch('hasLoaded');
			}
		},
		hasLoaded({ commit }) {
			commit('CONTENT_LOADED');
		},
		addTranslation({ commit }, translation) {
			commit('ADD_TRANSLATION', translation);
		},
		setLang({ commit }, lang) {
			commit('SET_LANG', lang);
		},
		enableHomeCursor({ commit }) {
			commit('ENABLE_HOME_CURSOR');
		},
		updateWebglHomeState({ commit }, homeState) {
			commit('UPDATE_WEBGL_HOME_STATE', homeState);
		},
		updateWebglHomeDisplay({ commit }, displayed) {
			commit('UPDATE_WEBGL_HOME_DISPLAY', displayed);
		},
		startHomeCursorAnimation({ commit }) {
			commit('UPDATE_HOME_CURSOR_ANIMATED', true);
		},
		endHomeCursorAnimation({ commit }) {
			commit('UPDATE_HOME_CURSOR_ANIMATED', false);
		},
		addZone({ commit }, {name, number}) {
			commit('ADD_ZONE', {zoneName: name, zoneNumber: number});
		},
		updateWebglExpState({ commit }, expState) {
			commit('UPDATE_WEBGL_EXP_STATE', expState);
		},
		updateWebglExpDisplay({ commit }, displayed) {
			commit('UPDATE_WEBGL_EXP_DISPLAY', displayed);
		},
		showExpTooltip({ commit }) {
			commit('UPDATE_EXP_TOOLTIP', true);
		},
		hideExpTooltip({ commit }) {
			commit('UPDATE_EXP_TOOLTIP', false);
		},
		enableRaycast({ commit }) {
			commit('UPDATE_RAYCAST_ENABLE', true);
		},
		disableRaycast({ commit }) {
			commit('UPDATE_RAYCAST_ENABLE', false);
		},
		updateRaycastZone({ commit, dispatch, getters }, number) {
			if(number != null && number != getters.exp.raycast.zone && !getters.exp.zones.find(zone => zone.number == number).animated && !getters.exp.zones.find(zone => zone.number == number).displayed) {
				dispatch('startExpCursorAnimation');
			} else if(number == null) {
				dispatch('endExpCursorAnimation');
			}
			commit('UPDATE_RAYCAST_ZONE', number);
		},
		startExpCursorAnimation({ commit }) {
			commit('UPDATE_EXP_CURSOR_ANIMATED', true);
		},
		endExpCursorAnimation({ commit }) {
			commit('UPDATE_EXP_CURSOR_ANIMATED', false);
		},
		startZoneAnimation({ commit }, zoneNumber) {
			commit('START_ZONE_ANIMATION', zoneNumber);
			commit('UPDATE_RAYCAST_ENABLE', false);
		},
		endZoneAnimation({ commit }, zoneNumber) {
			commit('END_ZONE_ANIMATION', zoneNumber);
			commit('UPDATE_RAYCAST_ENABLE', true);
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
		lang: state => state.uiData.lang,
		home: state => state.WebGL.home,
		exp: state => state.WebGL.exp,
		objects: state => state.objects,
		object: state => name => {
			return state.objects[name];
		}
	}
});

export default store;
