import assetsLists from './assets.json';
import 'three/examples/js/loaders/AWDLoader';

export const getObjects = function(Store) {
	const LoadingManager = new THREE.LoadingManager();

	Store.dispatch('setToLoadTotal', assetsLists.objects.length);

	LoadingManager.onProgress = (item, loaded) => {
		Store.dispatch('updateLoadedCount', loaded);
	};

	const AWDLoader = new THREE.AWDLoader(LoadingManager);

	const promises = [];
	assetsLists.objects.forEach(model => {
		promises.push(
			new Promise(resolve => {
				AWDLoader.load('/assets3d/' + model.name + '.awd', obj => {
					Store.dispatch('addObject', {
						name: model.name,
						obj: obj
					});
					resolve();
				});
			})
		);
	});

	return Promise.all(promises);
};

export const getAll = function(Store) {
	if(!Store.getters.loaded) {
		let promises = [
			getObjects(Store)
		];
		return Promise.all(promises).then(() => {
			Store.dispatch('hasLoaded');
		});
	} else {
		return new Promise(resolve => resolve());
	}
};
