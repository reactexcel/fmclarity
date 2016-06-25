import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';



Navigation = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var user,team,modules;
        team = Session.getSelectedTeam();
        user = Meteor.user();
        modules = Config.getModules(user,team); //should be user.getModules(team)

        return {
            team:team,
            modules:modules||[]
        }
    },

    onMenuClick() {
        $(".body-small").toggleClass("mini-navbar");
    },

    render() {
        var modules = this.data.modules;

        if(modules.length<=1) {
            return <div/>
        }
        return (
        <nav className="navbar-static-side">
            <div className="sidebar-collapse">
                <ul className="nav" id="side-menu" onClick={this.onMenuClick}>
                {this.data.modules.map(function(m){
                    return (
                        <li key={m.path} className={FlowRouter.getRouteName()==m.path?'active':''}>
                            <a href={FlowRouter.path(m.path)}>
                                <i className={m.icon}></i>
                                <span className="nav-label">{m.label}</span>
                            </a>
                        </li>
                    )
                })}
                </ul>
            </div>
        </nav>
        )
    }
})
