import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { ContactCard } from 'meteor/fmc:doc-members';

export default UserProfileMenu = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        Meteor.subscribe( 'teamsAndFacilitiesForUser' );
        Meteor.subscribe( 'notifications' );
        var user, team, role, teams, notifications;
        user = Meteor.user();
        if ( user ) {
            notifications = user.getNotifications();
            teams = user.getTeams();
            team = user.getTeam();
            if ( !teams || !teams.length ) {} else if ( !team ) {
                team = teams[ 0 ];
                user.selectTeam( team );
            } else if ( !team.name && !this.showingModal ) {
                this.showingModal = true;
                FABActions.editTeam( team );
            }
        }
        return {
            user: user,
            team: team,
            teams: teams,
            notifications: notifications
        }
    },

    selectTeam( team ) {
        Meteor.user().selectTeam( team );
    },

    createTeam() {
        Meteor.call( 'Teams.create', {}, function( err, response ) {
            //console.log(response);
            var team = Teams.findOne( response );
            //console.log(team);
            Modal.show( {
                content: <TeamViewEdit item={team}/>
            } )
        } )
    },

    resetTestData() {
        Meteor.call( "resetTestData" );
    },

    render() {
        if ( !this.data.team ) {
            return ( < div style = {
                    {
                        background: "rgba(0,0,0,0.5)",
                        position: "fixed",
                        zIndex: 5000,
                        left: "0px",
                        right: "0px",
                        top: "0px",
                        bottom: "0px",
                        textAlign: "center"
                    }
                } >
                < div style = {
                    {
                        position: "absolute",
                        width: "100px",
                        marginLeft: "-50px",
                        left: "50%",
                        top: "50%",
                        marginTop: "-50px"
                    }
                } >
                <RefreshIndicator
                            size={100}
                            left={0}
                            top={0}
                            status="loading"
                        /> < /div> < /div >
            )
        }
        var userEmail = Meteor.user() && Meteor.user().emails ? Meteor.user().emails[ 0 ].address : '';
        var userThumb = Meteor.user() ? Meteor.user().getThumbUrl() : '';
        var selectedTeam = this.data.team;
        var teams = this.data.teams;
        var component = this;
        return (
            <div id="settings-icon" className="dropdown right-dropdown">
            <span className="dropdown-toggle count-info" data-toggle="dropdown">
                {this.props.children}
            </span>
            <ul id="settings-menu" className="fm-layout-menu user-profile-menu dropdown-menu dropdown-alerts">
                <li>
                    <a style={{padding:"7px 8px",height:"48px"}} href={FlowRouter.path('profile')}>
                        <ContactCard item={this.data.user}/>
                    </a>
                </li>
                {this.data.teams && this.data.teams.length?<li className="divider"></li>:null}
                {this.data.teams && this.data.teams.length?this.data.teams.map(function(team){
                    return (
                        <li key={team._id} className={(team&&selectedTeam&&team._id==selectedTeam._id)?"active":''} onClick={component.selectTeam.bind(component,team)}>
                            <a style={{padding:"7px 0px 6px 7px"}}><ContactCard item={team}/></a>
                        </li>
                    )
                }):null}
                <li className="divider"></li>

                {selectedTeam /*&& Teams.save.allowed( selectedTeam )*/?

                <li>
                    <a href={FlowRouter.path('account')}>
                        <i className="fa fa-cog"></i>&nbsp;&nbsp;
                        <span className="nav-label">Team Settings</span>
                    </a>
                </li>
                :
                null

                }

                {Meteor.isDevelopment?
                <li>
                    <a href={FlowRouter.path('admin')}>
                        <i className="fa fa-cog"></i>&nbsp;&nbsp;
                        <span className="nav-label">Admin Tools</span>
                    </a>
                </li>
                :null}

                {Meteor.isDevelopment?
                <li>
                    <a onClick={this.createTeam}>
                        <i className="fa fa-plus"></i>&nbsp;&nbsp;
                        <span className="nav-label">Create team</span>
                    </a>
                </li>
                :null}

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
} )
