import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';


import UserProfileMenu from './UserProfileMenu.jsx';
import { FMInstantSearchBox } from '/modules/ui/MaterialInputs';

export default function TopNavigationBar( props ) {

    import { NotificationList } from '/modules/models/Messages';

    setTimeout( () => {

        $( '#alerts-icon' ).on( 'hidden.bs.dropdown', () => {
            if ( props.onMessagesViewed ) {
                Meteor.defer(
                    function() {
                        props.onMessagesViewed();
                    }
                )
            }
        } )
        notify.requestPermission();
        notify.config( {
            pageVisibility: false,
            autoClose: 5000
        } );

    }, 1000 );

    function toggleLeftSideBar() {
        //should we change some global property?
        $( 'body' ).toggleClass( 'nav-drawer-closed' );
    }

    let { notifications, unreadCount, user, team, teams } = props;

    return (
        <div className="top-navigation-bar noprint">
            <div className="sidebar-back-screen" onClick = { toggleLeftSideBar }></div>
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
                                { unreadCount ?
                                    <span className="label label-notification">{ unreadCount }</span>
                                : null }
                            </div>
                        </span>
                        <NotificationList items = { notifications }/>
                        <DesktopNotificationPopUp { ...props } />
                    </div>
                    <div className="searchbox">
                    {/*<FMInstantSearchBox/>*/}
                    </div>
                </div>
            </nav>
        </div>
    )
}

class DesktopNotificationPopUp extends React.Component {

    constructor( props ) {
        super( props );
        this.showPopUp = false;
    }

    componentWillReceiveProps( props ) {
        let user = props.user,
            notifications = null;
        if ( user ) {
            import { Messages } from '/modules/models/Messages';
            // notifications = Messages.findAll( { 'inboxId.query._id': user._id, wasShown: false } );
            notifications = this.props.notifications ? this.props.notifications : null;
            if ( !this.showPopUp ) {
                let component = this;
                if ( notifications && notifications.length ) {
                    component.showPopUp = Meteor.apply( 'Messages.setAllShown', [ notifications ], { returnStubValue: true } );
                }
            } else if ( this.showPopUp && notifications.length ) { // when new notification arrived after loggin.
                this.props.showNotifications( notifications );
            }
        }
    }

    render() {
        return (
            <div />
        )
    }
}
