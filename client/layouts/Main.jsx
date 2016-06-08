/*MainLayout = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <main>{this.props.content}</main>
      </div>
    );
  }
});
*/

import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


MainLayout = React.createClass({

  checkSize() {
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
    // Minimalize menu when screen is less than 768px
    this.checkSize();
    $(window).bind("resize", this.checkSize);

    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
     $('body').addClass('md-skin');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    /*
    $('body').addClass('fixed-sidebar');
     $('.sidebar-collapse').slimScroll({
         height: '100%',
         railOpacity: 0.9
     });
    */
    
    // slim scroll for right sidebar
    $('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');

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
            <div id="page-wrapper-inner">
              {this.props.content}
            </div>
          </main>
        </div>
        <Modal/>
      </div>
      </MuiThemeProvider>
    );
  }
});

