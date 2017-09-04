import Reflux from 'reflux';
export const loaderStoreActions = Reflux.createActions([
  'setLoaderVisibility', 'getLoaderVisibility'
]);

export default class LoaderStore extends Reflux.Store {
  constructor() {
    super();
    this.state = {
      visible: false
    };
    this.listenToMany(loaderStoreActions); // listen to the statusUpdate action
  }

  onSetLoaderVisibility(bool) {
    try {
      this.setState({ visible: Boolean(bool) });
    } catch (e) {
      // console.warn(e);
    }
  }

  onGetLoaderVisibility() {
    return this.state.visible;
  }

}