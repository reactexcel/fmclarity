import React from "react";
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { ContactCard } from '/modules/mixins/Members';
import { Actions, Routes } from '/modules/core/Actions';

export default function UserProfileMenu( props ) {

    function selectTeam( team ) {
        Meteor.user().selectTeam( team );
    }

    function createTeam() {
        Meteor.call( 'Teams.create', {}, function( err, response ) {
            //console.log(response);
            var team = Teams.findOne( response );
            //console.log(team);
            Modal.show( {
                content: <TeamViewEdit item={team}/>
            } )
        } )
    }

    function resetTestData() {
        Meteor.call( "resetTestData" );
    }

    let { user, team, teams } = props;

    if ( !team ) {
        return ( 
            <div style = { {
                background: "rgba(0,0,0,0.5)",
                position: "fixed",
                zIndex: 5000,
                left: "0px",
                right: "0px",
                top: "0px",
                bottom: "0px",
                textAlign: "center"
            } }>
            <div style = { {
                position: "absolute",
                width: "100px",
                marginLeft: "-50px",
                left: "50%",
                top: "50%",
                marginTop: "-50px"
            } }>
                <RefreshIndicator
                    size={100}
                    left={0}
                    top={0}
                    status="loading"/> 
            </div>
            </div>
        )
    }
    let userEmail = user && user.emails ? user.emails[ 0 ].address : '',
        userThumb = user ? user.thumbUrl : '';

    return (
        <div id="settings-icon" className="dropdown right-dropdown">
            <span className="dropdown-toggle count-info" data-toggle="dropdown">
                {props.children}
            </span>
            <ul id="settings-menu" className="fm-layout-menu user-profile-menu dropdown-menu dropdown-alerts">
                <li>
                    <a style={{padding:"7px 8px",height:"48px"}} href={FlowRouter.path('profile')}>
                        <ContactCard item={user}/>
                    </a>
                </li>
                {teams && teams.length?<li className="divider"></li>:null}
                {teams && teams.length?teams.map( ( t ) => {
                    return (
                        <li key = { t._id } className={ ( team && t && team._id == t._id )?"active":''} onClick={ () => { this.selectTeam( team ) } } >
                            <a style={{padding:"7px 0px 6px 7px"}}>
                                <ContactCard item = { t }/>
                            </a>
                        </li>
                    )
                }):null}
                <li className="divider"></li>

                { team /*&& Teams.save.allowed( selectedTeam )*/?

                <li>
                    <a onClick = { () => { Actions.run("edit team", team) } }>
                        <i className="fa fa-cog"></i>&nbsp;&nbsp;
                        <span className="nav-label">Team Settings</span>
                    </a>
                </li>
                : null }

                {Meteor.isDevelopment?
                <li>
                    <a onClick = { () => { Routes.run("admin") } }>
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
                    <a onClick = { () => { Routes.run("logout") } }>
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
