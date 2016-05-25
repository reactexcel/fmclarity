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

import React from 'react';
import {mount} from 'react-mounter';

var loggedIn = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      if (!(Meteor.loggingIn() || Meteor.userId())) {
        route = FlowRouter.current();
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

admin = FlowRouter.group({
  triggersEnter: [
    function(context, redirect) {
      var route;
      var user = Meteor.user();
      //console.log(user);
      if(Meteor.loggingIn()||(user&&user.role=='dev')) {
        return;
      }
      FlowRouter.go('/');
      //if (!(Roles.userIsInRole(Meteor.user(),['admin']))) {
    }
  ]
});

admin.route('/admin',{
  name: 'admin',
  action() {
    mount(MainLayout,{content:<AdminPage/>});
  }
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

loggedIn.route('/', {
  name: 'root',
  action() {
    mount(MainLayout, {content:<LandingPage/>});
    //mount(MainLayout,{content:<LandingPage/>});
  }
});


//probably better called request/:_id
//also... token required
loggedIn.route('/requests/:_id', {
  name: 'request',
  action(params) {
    mount(MainLayout,{content:<IssuePage selected={params._id} />});
  }
});

loggedIn.route('/change-password',{
  name:'change-password',
  action() {
    mount(BlankLayout,{content:<PageChangePassword/>});
  }
})

loggedIn.route('/pmp', {
  name: 'pmp',
  action() {
    mount(MainLayout,{content:<PageMaintenence/>});
  }
});

loggedIn.route('/abc', {
  name: 'abc',
  action() {
    mount(MainLayout,{content:<PageCompliance/>});
  }
});

loggedIn.route('/requests', {
  name: 'requests',
  action() {
    mount(MainLayout,{content:<IssuesIndexPage/>});
  }
});

loggedIn.route('/dashboard', {
  name: 'dashboard',
  action() {
    mount(MainLayout,{content:<DashboardPage/>});
  }
});

loggedIn.route('/messages', {
  name: 'messages',
  action() {
    mount(MainLayout,{content:<MessagesPage />});
  }
});

loggedIn.route('/suppliers', {
  name: 'suppliers',
  action() {
    mount(MainLayout,{content:<SupplierIndexPage />});
  }
});

loggedIn.route('/settings', {
  name: 'settings',
  action() {
    mount(MainLayout,{content: <PageSettings />});
  }
});

loggedIn.route('/account', {
  name: 'account',
  action() {
    mount(MainLayout,{content: <TeamProfilePage />});
  }
});

loggedIn.route('/profile', {
  name: 'profile',
  action() {
    mount(MainLayout,{content: <UserProfilePage />});
  }
});

loggedIn.route('/team', {
  name: 'team',
  action() {
    mount(MainLayout,{content: <TeamIndexPage />});
  }
});

loggedIn.route('/portfolio', {
  name: 'portfolio',
  action() {
    mount(MainLayout,{content: <FacilityIndexPage />});
  }
});

loggedIn.route('/reports', {
  name: 'reports',
  action() {
    mount(MainLayout,{content: <ReportsIndexPage />});
  }
});

loggedIn.route('/documents', {
  name: 'documents',
  action() {
    mount(MainLayout,{content: <DocsPageIndex />});
  }
});

loggedIn.route('/contacts', {
  name: 'contacts',
  action() {
    mount(MainLayout,{content: <UsersPage />});
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
    mount(BlankLayout, { content: <NotFound /> });
  }
};