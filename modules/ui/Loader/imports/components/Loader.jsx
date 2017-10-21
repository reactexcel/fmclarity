import React from 'react';

export default class Loader extends React.Component {

  render() {
    return (
      <div className="loader">
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

export const hideLoader = () => {
  $('.loader').hide();
};

export const showLoader = () => {
  $('.loader').show();
};