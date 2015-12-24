

UserProfileMenu = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('notifications');
        var user, team, teams, notifications;
        user = Meteor.user();
        if(user) {
            team = user.getSelectedTeam();
            teams = user.getTeams();
            notifications = user.getNotifications();
        }
        return {
            user:user,
            team:team,
            teams:teams,
            notifications:notifications
        }
    },

    selectTeam(team) {
        Meteor.user().selectTeam(team);
    },

    render() {
        if(!this.data.user||!this.data.team) {
            return (<div/>)
        }
        var userEmail = Meteor.user()&&Meteor.user().emails?Meteor.user().emails[0].address:'';
        var userThumb = Meteor.user()?Meteor.user().getThumbUrl():'';
        var selectedTeam = this.data.team;
        var teams = this.data.teams;
        var component = this;
        return (
        <div className="dropdown right-dropdown">
            <span className="dropdown-toggle count-info" data-toggle="dropdown">
                {this.props.children}
            </span>
            <ul className="dropdown-menu dropdown-alerts">
                <li style={{padding:"10px"}}>
                    <ContactCard item={this.data.user}/>
                </li>
                <li className="divider"></li>
                {this.data.teams.map(function(team){
                    return (
                        <li key={team._id} className={team.name==selectedTeam.name?"active":''} onClick={component.selectTeam.bind(component,team)}>
                            <a>{team.name}</a>
                        </li>
                    )
                })}
                <li className="divider"></li>
                <li>
                    <div className="text-center link-block">
                        <a href={FlowRouter.path('logout')}>
                            <i className="fa fa-sign-out"></i> Log out
                        </a>
                    </div>
                </li>
            </ul>
        </div>
        )
    }
})

TopNavBar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('notifications');
        var user, notifications;
        user = Meteor.user();
        if(user) {
            notifications = user.getNotifications();
        }
        return {
            user:user,
            notifications:notifications
        }
    },

    componentDidMount() {
        $('body').addClass('fixed-nav');
        $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
    },

    render() {
        if(!this.data.user) {
            return (<div/>)
        }
        var notifications = this.data.notifications;
        return (

    <div className="row">
        <div className="sidebar-back-screen" onClick={this.toggleLeftSideBar}></div>      
        <nav className="navbar navbar-fixed-top" role="navigation" style={{marginBottom:'0'}}>
            <div className="row">
                <div className="col-xs-2">
                    <span className="topnav-icon" onClick={this.toggleLeftSideBar}><i className="fa fa-bars"></i></span>
                </div>
                <div className="col-xs-8" style={{textAlign:"center"}}>
                    <img style={{width:"160px",margin:"6px"}} src="img/logo-white.svg"/>
                </div>
                <div className="hidden-xs col-sm-1">                
                    <div style={{float:"right"}} className="dropdown right-dropdown">
                        <span className="dropdown-toggle count-info topnav-icon" data-toggle="dropdown">
                            <i className="fa fa-bell"></i>
                            {notifications.length?
                                <span className="label label-notification" style={{top:"10px"}}>{notifications.length}</span>
                            :null}
                        </span>
                        <NotificationView items={notifications}/>
                    </div>
                </div>
                <div className="col-xs-2 col-sm-1">
                    <div style={{float:"right"}}>
                        <UserProfileMenu>
                            <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                        </UserProfileMenu>
                    </div>
                </div>
            </div>
        </nav>
    </div>
);}});