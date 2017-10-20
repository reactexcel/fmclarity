import React from 'react';

export default class LoaderSmall extends React.Component {

  render() {
    return (
      <div className="small-loader">
        <div className="loader-content">
          <div className="preloader-wrapper small active">
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
  $('.small-loader').hide();
};

export const showLoader = () => {
  $('.small-loader').show();
};