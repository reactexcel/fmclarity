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
  },
});

exposed.route('/enroll-account/:token', {
  name: 'enroll',
  action(params,queryParams) {
    var token = params.token;
    Accounts.resetPassword(token,'fm1q2w3e');
    Accounts.verifyEmail(token);
    FlowRouter.go('/login');
  }
});

//probably better called request/:_id
//also... token required
exposed.route('/requests/:_id', {
  name: 'request',
  action(params) {
    ReactLayout.render(MainLayout,{content:<IssuePage selected={params._id} />});
  }
});

/*
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
*/

var loggedIn = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
        if (route.route.name != 'login') {
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
    var redirect = Session.get('redirectAfterLogin')||'/';
    Session.set('redirectAfterLogin',null)
    return FlowRouter.go(redirect);
  });
}

loggedIn.route('/', {
  name: 'root',
  action() {
    ReactLayout.render(MainLayout,{content:<LandingPage />});
  }
});

loggedIn.route('/pmp', {
  name: 'pmp',
  action() {
    ReactLayout.render(MainLayout,{content:<PageMaintenence />});
  }
});

loggedIn.route('/abc', {
  name: 'abc',
  action() {
    ReactLayout.render(MainLayout,{content:<PageCompliance />});
  }
});

loggedIn.route('/requests', {
  name: 'requests',
  action() {
    ReactLayout.render(MainLayout,{content:<IssuesIndexPage />});
  }
});

loggedIn.route('/dashboard', {
  name: 'dashboard',
  action() {
    ReactLayout.render(MainLayout,{content:<DashboardPage />});
  }
});

loggedIn.route('/messages', {
  name: 'messages',
  action() {
    ReactLayout.render(MainLayout,{content:<MessagesPage />});
  }
});

loggedIn.route('/contracts', {
  name: 'contracts',
  action() {
    ReactLayout.render(MainLayout,{content:<PageContracts />});
  }
});
loggedIn.route('/suppliers', {
  name: 'suppliers',
  action() {
    ReactLayout.render(MainLayout,{content:<SupplierIndexPage />});
  }
});

loggedIn.route('/reports', {
  name: 'reports',
  action() {
    ReactLayout.render(MainLayout,{content:<PageReports />});
  }
});

loggedIn.route('/settings', {
  name: 'settings',
  action() {
    ReactLayout.render(MainLayout,{content: <PageSettings />});
  }
});

loggedIn.route('/account', {
  name: 'account',
  action() {
    ReactLayout.render(MainLayout,{content: <TeamProfilePage />});
  }
});

loggedIn.route('/profile', {
  name: 'profile',
  action() {
    ReactLayout.render(MainLayout,{content: <UserProfilePage />});
  }
});

loggedIn.route('/team', {
  name: 'team',
  action() {
    ReactLayout.render(MainLayout,{content: <TeamIndexPage />});
  }
});

loggedIn.route('/portfolio', {
  name: 'portfolio',
  action() {
    ReactLayout.render(MainLayout,{content: <FacilityIndexPage />});
  }
});

loggedIn.route('/contacts', {
  name: 'contacts',
  action() {
    ReactLayout.render(MainLayout,{content: <UsersPage />});
  }
});

loggedIn.route('/logout', {
  name: 'logout',
  action() {
    Meteor.logout(function() {
      return FlowRouter.go('/');
    });
  }
});

FlowRouter.notFound = {
  action() {
    ReactLayout.render(BlankLayout, { content: <NotFound /> });
  }
};