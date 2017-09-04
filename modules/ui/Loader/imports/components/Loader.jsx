import React from 'react';

export default class Loader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible ? props.visible : false
    };
  }

  render() {
    let loaderClass = ['loader'];
    if (Session.get('showLoader')) {
      loaderClass = ['loader'];
    } else if (!this.state.visible) {
      loaderClass = ['loader', 'hidden'];
    }
    console.log(Session.get('showLoader'));

    return (
      <div className={ loaderClass.join(' ') }>
        <div className="loader-content">
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-custom-blue-only">
              <div className="circle-clipper left">
                <div className="circle"/>
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