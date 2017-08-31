import React from 'react';
import Reflux from 'reflux';

import LoaderStore from '../store/LoaderStore';

export default class Loader extends Reflux.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.store = LoaderStore;
    this.storeKeys = ['visible'];
  }

  render() {

    let loaderClass = ['loader'];
    if (!this.state.visible) {
      loaderClass.push('hidden');
    }

    return (
      <div className={ loaderClass.join(' ') }>
        <div className="loader-content">
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-custom-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"/>
              </div>
              <div className="circle-clipper right">
                <div className="circle"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}