import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

export default class Loader extends Component {

  render() {

    const style = {
      refresh: {
        backgroundColor: '',
        boxShadow: '',
      },
    };

    return (
      <div className="loader hidden">
        <div className="loader-content">
          <!-- PRELOADER -->
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-custom-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}