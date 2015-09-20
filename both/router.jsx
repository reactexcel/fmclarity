// Reaktor API:  https://github.com/kadirahq/meteor-reaktor
// Router API:   https://github.com/meteorhacks/flow-router

// NOTE see flow-router branch for the vanilla router

// Layout API https://github.com/kadirahq/meteor-react-layout
/*
Reaktor.init(
  <Router>
    <Route path="/" content={Home} layout={MainLayout} />
    <Route path="/about" content={About} layout={MainLayout} />
  </Router>
);
*/
// Router API https://github.com/meteorhacks/flow-router

var exposed = FlowRouter.group();

exposed.route('/login', {
  name: 'login',
  action() {
    ReactLayout.render(BlankLayout,{content:<Login />});
  }
});

exposed.route('/register', {
  name: 'register',
  action() {
    ReactLayout.render(BlankLayout,{content:<Register />});
  }
});

exposed.route('/lost-password', {
  name: 'lost-password',
  action() {
    ReactLayout.render(BlankLayout,{content:<LostPassword />});
  }
});

exposed.route('/landing', {
  action() {
    ReactLayout.render(BlankLayout,{content:<Landing />});
  }
});

var loggedIn = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
        if (route.route.name !== 'login') {
          Session.set('redirectAfterLogin', route.path);
        }
        redirect('/login');
      }
    }
  ]
});

var admin = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      if (!(Roles.userIsInRole(Meteor.user(),['admin']))) {
        return FlowRouter.go('/dashboard');
      }
    }
  ]
});

if(Meteor.isClient) {
  Accounts.onLogin(function() {
    var redirect = Session.get('redirectAfterLogin') || FlowRouter.path('dashboard');
    if (redirect !== '/login') {
      Session.set('redirectAfterLogin',null)
      return FlowRouter.go(redirect);
    }
  });
}

loggedIn.route('/dashboard', {
  name: 'dashboard',
  action() {
    ReactLayout.render(MainLayout,{content:<Dashboard />});
  }
});

loggedIn.route('/settings', {
  name: 'settings',
  action() {
    ReactLayout.render(MainLayout,{content: <Settings />});
  }
});

loggedIn.route('/logout', {
  name: 'logout',
  action() {
    return Meteor.logout(function() {
      return FlowRouter.go('/');
    });
  }
});

FlowRouter.route('/', {
  action() {
    ReactLayout.render(BlankLayout, { content: <Landing /> });
  }
});

loggedIn.route('/about', {
  action() {
    ReactLayout.render(MainLayout, { content: <About /> });
  }
});

FlowRouter.notFound = {
  action() {
    ReactLayout.render(BlankLayout, { content: <NotFound /> });
  }
};