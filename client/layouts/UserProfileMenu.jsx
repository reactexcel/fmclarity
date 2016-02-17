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

    resetTestData() {
        Meteor.call("resetTestData");
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
            <ul className="fm-layout-menu user-profile-menu dropdown-menu dropdown-alerts">
                <li>
                    <a style={{padding:"10px 10px 6px 10px"}} href={FlowRouter.path('profile')}>
                        <ContactCard item={this.data.user}/>
                    </a>
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
                    <a href={FlowRouter.path('account')}>
                        <i className="fa fa-cog"></i>&nbsp;&nbsp;
                        <span className="nav-label">Account Settings</span>
                    </a>
                </li>
                <li>
                    <a onClick={this.resetTestData}>
                        <i className="fa fa-cog"></i>&nbsp;&nbsp;
                        <span className="nav-label">Reset test data</span>
                    </a>
                </li>
                <li>
                    <a href={FlowRouter.path('logout')}>
                        <i className="fa fa-sign-out"></i> Log out
                    </a>
                </li>
                <li>
                    <a style={{padding:0,textAlign:"right",fontSize:"8px",paddingRight:"15px"}} target="_blank" href="https://bitbucket.org/mrleokeith/fm-clarity/src/develop/CHANGELOG.md">v{FM.version}</a>
                </li>
            </ul>
        </div>
        )
    }
})