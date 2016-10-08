import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Notifications, NotificationList } from '/modules/models/Notifications';

import UserProfileMenu from './UserProfileMenu.jsx';

export default function TopNavigationBar( props ) {

    setTimeout(() => {

        $( '#alerts-icon' ).on( 'hidden.bs.dropdown', () => {
            if ( props.onNotificationsViewed ) {
                props.onNotificationsViewed();
            }
        } )
        notify.requestPermission();
        notify.config( {
            pageVisibility: false,
            autoClose: 5000
        } );

    },1000);

    function toggleLeftSideBar() {
        //should we change some global property?
        $( 'body' ).toggleClass( 'nav-drawer-closed' );
    }

    let { notifications, user, team, teams } = props;

    return (
        <div className="top-navigation-bar">
            <div className="sidebar-back-screen" onClick = {toggleLeftSideBar }></div>
            <nav className="nav-bar">
                <div className="icon-region-1">
                    <span id="nav-menu-icon" className="topnav-icon" onClick = { toggleLeftSideBar }><i className="fa fa-bars"></i></span>
                </div>

                <div className="logo-region">
                    <img className="fm-logo" src="/img/logo-white.svg"/>
                </div>
                <div className="icon-region-2">
                    <div style={{float:"right"}}>
                        <UserProfileMenu { ...props }>
                            <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                        </UserProfileMenu>
                    </div>
                    <div id="alerts-icon" style={{float:"right"}} className="hidden-xs hidden-sm dropdown right-dropdown">
                        <span className="dropdown-toggle count-info topnav-icon" data-toggle="dropdown">
                            <i className="fa fa-bell"></i>
                            <div style={{float:"right",width:"15px"}}>
                                { notifications && notifications.length ?
                                    <span className="label label-notification">{notifications.length}</span>
                                : null }
                            </div>
                        </span>
                        <NotificationList items={notifications}/>
                    </div>
                </div>
            </nav>
        </div>

    )
}
