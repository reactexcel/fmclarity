TopNavBar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('notifications');
        var user, notifications;
        user = Meteor.user();
        if(user) {
            notifications = user.getNotifications();
        }
        return {
            user:user,
            notifications:notifications
        }
    },

    componentDidMount() {
        $('body').addClass('fixed-nav');
        $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
    },

    render() {
        if(!this.data.user) {
            return (<div/>)
        }
        var notifications = this.data.notifications;
        return (

    <div className="row">
        <div className="sidebar-back-screen" onClick={this.toggleLeftSideBar}></div>      
        <nav className="navbar navbar-fixed-top" role="navigation" style={{marginBottom:'0'}}>
            <div className="row">
                <div className="col-xs-2">
                    <span className="topnav-icon" onClick={this.toggleLeftSideBar}><i className="fa fa-bars"></i></span>
                </div>
                <div className="col-xs-8" style={{textAlign:"center"}}>
                    <img style={{width:"160px",margin:"6px"}} src="img/logo-white.svg"/>
                </div>
                <div className="col-xs-2">
                    <div style={{float:"right"}}>
                        <UserProfileMenu>
                            <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                        </UserProfileMenu>
                    </div>
                    <div style={{float:"right"}} className="hidden-xs dropdown right-dropdown">
                        <span className="dropdown-toggle count-info topnav-icon" data-toggle="dropdown">
                            <i className="fa fa-bell"></i>
                            {notifications.length?
                                <span className="label label-notification">{notifications.length}</span>
                            :null}
                        </span>
                        <NotificationView items={notifications}/>
                    </div>
                </div>
            </div>
        </nav>
    </div>
);}});