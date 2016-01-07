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
                    <a href={FlowRouter.path('profile')}>
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
                    <div className="text-center link-block">                    
                        <a href={FlowRouter.path('account')}>
                            <i className="fa fa-cog"></i>&nbsp;&nbsp;
                            <span className="nav-label">Account Settings</span>
                        </a>
                    </div>
                </li>
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