import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


MainLayout = React.createClass({

  checkSize() {
    // Minimise menu when screen is less than 768px
    if (window.matchMedia('(max-width: 768px)').matches) {
    }
  },

  componentDidMount() {
    this.checkSize();
    $(window).bind("resize", this.checkSize);
  },

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <div className="body-background"/>
          <Navigation />
          <TopNavBar />
          <main className="page-wrapper">
            <div className="page-wrapper-inner">
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
    }
  },

  componentDidMount() {
    this.checkSize();
    $(window).bind("resize", this.checkSize);
  },

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <div className="body-background"/>
          <Navigation />
          <TopNavBar />
          <main className="page-wrapper">
            <div className="page-wrapper-inner">
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