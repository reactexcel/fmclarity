import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


MainLayout = React.createClass({

  checkSize() {
    // Minimise menu when screen is less than 768px
    if (window.matchMedia('(max-width: 768px)').matches) {
      $('body').addClass('body-small fixed-sidebar')
    } else {
      $('body').removeClass('body-small')
    }

    if(!$("body").hasClass('body-small')) {

      var navbarHeight = $('nav.navbar-default').height();
      var wrapperHeight = $('#page-wrapper').height();

      if(navbarHeight > wrapperHeight){
        $('#page-wrapper').css("min-height", navbarHeight + "px");
      }

      if(navbarHeight < wrapperHeight){
        $('#page-wrapper').css("min-height", $(window).height()  + "px");
      }

      if ($('body').hasClass('fixed-nav')) {
        $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
      }
    }    
  },

  componentDidMount() {
    this.checkSize();
    $(window).bind("resize", this.checkSize);
     $('body').addClass('md-skin');
  },

  componentWillUnmount() {
     $('body').removeClass('md-skin');
  },

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div id="wrapper">
        <Navigation />
          <TopNavBar />
          <main id="page-wrapper">
            <div id="page-wrapper-inner">
              {this.props.content}
            </div>
          </main>
        <FloatingActionButton/>
        <Modal/>
      </div>
      </MuiThemeProvider>
    );
  }
});

WideLayout = React.createClass({

  checkSize() {
    // Minimise menu when screen is less than 768px
    if (window.matchMedia('(max-width: 768px)').matches) {
      $('body').addClass('body-small fixed-sidebar')
    } else {
      $('body').removeClass('body-small')
    }

    if(!$("body").hasClass('body-small')) {

      var navbarHeight = $('nav.navbar-default').height();
      var wrapperHeight = $('#page-wrapper').height();

      if(navbarHeight > wrapperHeight){
        $('#page-wrapper').css("min-height", navbarHeight + "px");
      }

      if(navbarHeight < wrapperHeight){
        $('#page-wrapper').css("min-height", $(window).height()  + "px");
      }

      if ($('body').hasClass('fixed-nav')) {
        $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
      }
    }    
  },

  componentDidMount() {
    this.checkSize();
    $(window).bind("resize", this.checkSize);
     $('body').addClass('md-skin');
  },

  componentWillUnmount() {
     $('body').removeClass('md-skin');
  },

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
      <div id="wrapper">
        <Navigation />
        <div className="gradient-bg">
          <TopNavBar />
          <main id="page-wrapper">
            {this.props.content}
          </main>
        </div>
        <Modal/>
      </div>
      </MuiThemeProvider>
    );
  }
});