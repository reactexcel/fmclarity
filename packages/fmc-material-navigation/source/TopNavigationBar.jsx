import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import UserProfileMenu from './UserProfileMenu.jsx';

export default TopNavigationBar = React.createClass(
{

    mixins: [ ReactMeteorData ],

    shown: {},

    getMeteorData()
    {
        //Meteor.subscribe('notifications');
        let user = Meteor.user(),
            notifications = null;

        if ( user )
        {
            Meteor.subscribe( "messages", "users", user._id );
            notifications = user.getNotifications();
            var count = notifications.length;
            if ( count > this.oldCount )
            {
                this.oldCount = count;
                if ( notifications && notifications.length )
                {
                    this.audio.play();
                    var suppressFurtherNotifications = false;
                    if ( notifications.length > 2 )
                    {
                        this.showNotification(
                            "You have FM Clarity notifications",
                            "You have more than 3 new notifications from FM Clarity"
                        );
                        suppressFurtherNotifications = true;
                    }
                    else
                    {
                        notifications.map( ( n ) =>
                        {
                            if ( !this.shown[ n._id ] )
                            {
                                this.shown[ n._id ] = true;
                                if ( !suppressFurtherNotifications )
                                {
                                    this.showNotification( n.subject, n.body );
                                }
                            }
                        } )
                    }
                }
                //toastr notification
                //alert(count+" new messages");
            }
        }
        return {
            user: user,
            notifications: notifications
        }
    },

    showNotification( title, body )
    {
        notify.createNotification( title,
        {
            body: body,
            icon: "icon-64x64.ico"
        } );
    },

    componentDidMount()
    {

        $( this.refs.notifications ).on( 'hidden.bs.dropdown', () =>
        {
            if ( this.data.user )
            {
                this.count = 0;
                this.oldCount = 0;
                this.data.user.markAllNotificationsAsRead();
            }
        } )
        this.oldCount = 0;
        this.audio = new Audio( '/audio/alert3.wav' );
        notify.requestPermission();
        notify.config(
        {
            pageVisibility: false,
            autoClose: 5000
        } );
    },

    toggleLeftSideBar()
    {
        //should we change some global property?
        $( 'body' ).toggleClass( 'nav-drawer-closed' );
    },

    render()
    {
        var notifications = this.data.notifications;
        return (
            <div className="top-navigation-bar">
            <div className="sidebar-back-screen" onClick={this.toggleLeftSideBar}></div>      
            <nav className="nav-bar">
                <div className="icon-region-1">
                    <span id="nav-menu-icon" className="topnav-icon" onClick={this.toggleLeftSideBar}><i className="fa fa-bars"></i></span>
                </div>

                <div className="logo-region">
                    <img className="fm-logo" src="/img/logo-white.svg"/>
                </div>
                <div className="icon-region-2">
                    <div style={{float:"right"}}>
                        <UserProfileMenu>
                            <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                        </UserProfileMenu>
                    </div>
                    <div id="alerts-icon" style={{float:"right"}} ref="notifications" className="hidden-xs hidden-sm dropdown right-dropdown">
                        <span className="dropdown-toggle count-info topnav-icon" data-toggle="dropdown">
                            <i className="fa fa-bell"></i>
                            <div style={{float:"right",width:"15px"}}>
                                {notifications&&notifications.length?
                                    <span className="label label-notification">{notifications.length}</span>
                                :null}
                            </div>
                        </span>
                        <NotificationList items={notifications}/>
                    </div>
                </div>
            </nav>
        </div>

        )
    }
} );
