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
    let visibility = Boolean(bool);
    if (visibility === this.state.visible) {
      return;
    }
    this.setState({ visible: visibility });
  }

  onGetLoaderVisibility() {
    return this.state.visible;
  }

}