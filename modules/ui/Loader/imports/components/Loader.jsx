import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import '../client/Loader.less';

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
          <RefreshIndicator
            size={100}
            left={0} top={0}
            status="loading"
            style={style.refresh}
          />
        </div>
      </div>
    );
  }
}