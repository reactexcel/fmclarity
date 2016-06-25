import React from "react";
import {mount} from 'react-mounter';

var exposed = FlowRouter.group();
loggedIn = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
        console.log(route);
        if (route.route.name == 'login') {
          Session.set('redirectAfterLogin', '/');          
        }
        else {
          Session.set('redirectAfterLogin', route.path);
        }
        redirect('/login');
      }
    }
  ]
});

if(Meteor.isClient) {
  Accounts.onLogin(function() {
    var redirect = Session.get('redirectAfterLogin');
    if(redirect) {
      Session.set('redirectAfterLogin',null)
      return FlowRouter.go(redirect);
    }
  });
}

exposed.route('/login', {
  name: 'login',
  action() {
    var redirect = Session.get('redirectAfterLogin');
    if(!redirect) {
      Session.set('redirectAfterLogin','/');
    }
    mount(BlankLayout,{content:<PageLogin/>});
  },
});

exposed.route('/enroll-account/:token', {
  name: 'enroll',
  action(params,queryParams) {
    var token = params.token;
    Accounts.resetPassword(token,'fm1q2w3e');
    FlowRouter.go('/change-password');
  }
});

exposed.route('/403', {
  name: '403',
  action() {
    mount(BlankLayout,{content: <Page403/>});
  }
});

exposed.route('/register', {
  name: 'register',
  action() {
    mount(BlankLayout,{content:<PageRegister/>});
  }
});

exposed.route('/lost-password', {
  name: 'lost-password',
  action() {
    mount(BlankLayout,{content:<PageLostPassword/>});
  }
});

exposed.route('/reset-password/:token', {
  name: 'reset-password',
  action(params,queryParams) {
    var token = params.token;
    Session.set('redirectAfterLogin','/change-password');
    Accounts.resetPassword(token,'fm1q2w3e');
  }
});

// should not go to 'IssuePage', instead should go to 'logging in' page
exposed.route('/t/:token/:redirect', {
  name: 'loginWithToken',
  action(params) {
    //console.log(params);
    var redirect = Base64.decode(decodeURIComponent(params.redirect));
    redirect = String.fromCharCode.apply(null, redirect);
    //console.log(redirect);
    Meteor.loginWithToken(params.token,function(err){
      if(err) {
        console.log(err);
      }
      //console.log('going to '+redirect);
      FlowRouter.go('/'+redirect);
    });
  }
});

// should not go to 'IssuePage', instead should go to 'logging in' page
exposed.route('/u/:token/:redirect', {
  name: 'loginWithToken',
  action(params) {
    //console.log(params);
    var redirect = Base64.decode(decodeURIComponent(params.redirect));
    redirect = String.fromCharCode.apply(null, redirect);
    //console.log(redirect);
    FMCLogin.loginWithToken(params.token,function(err){
      if(err) {
        console.log(err);
        FlowRouter.go('/403');
      }
      else {
        //console.log('going to '+redirect);
        FlowRouter.go('/'+redirect);
      }
    });
  }
});
