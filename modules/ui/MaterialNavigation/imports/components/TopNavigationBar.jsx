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
                    <div className="searchbox hidden-xs" >
                        <FMInstantSearchBox mobileView={false}/>
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
                        <DesktopNotificationPopUp items = { notifications } showNotifications = { props.showNotifications } />
                    </div>
                    <div id="search-icon" style={{float:"right",marginTop:'2px'}} className="hidden-xl hidden-lg hidden-md hidden-sm">
                        <i className="fa fa-search" onClick={(e)=>{
                            if($("#search-icon").hasClass("open")){
                                $("#search-icon").removeClass("open")
                            }else{
                                $("#search-icon").addClass("open")
                                $('#searchInput1').focus()
                            }
                        }} ></i>
                        <div className="search">
                            <FMInstantSearchBox mobileView={true} />
                        </div>
                    </div>
                    <div style={{float:"right"}}>
                        <UserProfileMenu { ...props }>
                            <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                        </UserProfileMenu>
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

    /*
    shouldComponentUpdate( nextProps ) {

        console.log( {
            props: this.props,
            nextProps: nextProps
        } );

        if ( !this.props.notifications ) {
            return true;
        }
        else if ( !nextProps.notifications || ( nextProps.notifications.length <= this.props.notifications.length ) ) {
            return false;
        }
        else {
            return true;
        }
    }
    */

    componentWillReceiveProps( { items } ) {
        import { Messages } from '/modules/models/Messages';
        if ( !this.showPopUp ) {
            let component = this;
            if ( items && items.length ) {
                component.showPopUp = Meteor.apply( 'Messages.setAllShown', [ items ], { returnStubValue: true } );
            }
        } else if ( this.showPopUp && items.length ) { // when new notification arrived after loggin.
            this.props.showNotifications( items );
        }
    }

    render() {
        return (
            <div />
        )
    }
}
