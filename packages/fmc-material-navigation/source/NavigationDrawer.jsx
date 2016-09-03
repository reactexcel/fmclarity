import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

export default NavigationDrawer = React.createClass(
{
    mixins: [ ReactMeteorData ],

    getMeteorData() 
    {
        Meteor.subscribe('teamsAndFacilitiesForUser');

        let team    = Session.getSelectedTeam(),
            user    = Meteor.user(),
            modules = Config.getModules(user,team); //should be user.getModules(team)

        //console.log({user,team,modules});

        return { modules }
    },

    onMenuClick() 
    {
        //$('body').toggleClass('nav-drawer-closed');
    },

    render() 
    {
        let { modules } = this.data;

        if( modules == null )
        {
            /*shouldn't happen*/
        }
        else if(modules.length <= 1) 
        {
            return <div/>
        }

        return (

        <nav className="nav-drawer">
            <ul onClick={ this.onMenuClick }>

            {/*******************************************/
            modules.map( ( module ) => { 

            let pathName    = module.path,
                icon        = module.icon,
                label       = module.label,
                path        = FlowRouter.path( pathName ),
                classes     = [];

            if( FlowRouter.getRouteName() == pathName )
            {
                classes.push("active");
            }

            return (

            <li key = { pathName } className = { classes.join(' ') }>
                <a href={ path }>
                    <i className={ icon }></i>
                    <span>{ label }</span>
                </a>
            </li>

            )

            })/*******************************************/}

            </ul>
        </nav>

        )
    }
})
