TopNavBar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        //Meteor.subscribe('notifications');
        Meteor.subscribe("messages","users",Meteor.userId());
        var user, notifications;
        user = Meteor.user();
        if(user) {
            notifications = user.getNotifications();
            var count = notifications.length;
            if(count>this.oldCount) {
                this.oldCount = count;
                if(notifications&&notifications.length) {
                    var n = notifications[0];
                    this.audio.play();
                    this.showNotification(n.subject,n.body);
                }
                //toastr notification
                //alert(count+" new messages");
            }
        }
        return {
            user:user,
            notifications:notifications
        }
    },

    showNotification(title,body) {
        notify.createNotification(title,{
            body:body,
            icon:"icon-64x64.ico"
        });
    },

    componentDidMount() {

        $('body').addClass('fixed-nav');
        $('.navbar-static-top').removeClass('navbar-static-top').addClass('navbar-fixed-top');
        
        var component = this;
        $(this.refs.notifications).on('hidden.bs.dropdown', function () {
            if(component.data.user) {
                component.count = 0;
                component.oldCount = 0;
                component.data.user.markAllNotificationsAsRead();
            }
        })
        this.oldCount = 0;
        this.audio = new Audio('/audio/alert3.wav');
        //var permission = notify.permissionLevel();
        //console.log(permission);
        notify.requestPermission();
        notify.config({pageVisibility: false, autoClose: 5000});
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
    },

    componentDidUpdate() {
        //var audio = new Audio('audio.mp3');
        //audio.addEventListener('canplaythrough', function() {
        //audio.play();
        //});
    },

    render() {
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
                        <img style={{width:"160px",margin:"6px"}} src="/img/logo-white.svg"/>
                    </div>
                    <div className="col-xs-2">
                        <div style={{float:"right"}}>
                            <UserProfileMenu>
                                <span className="topnav-icon"><i className="fa fa-cog"></i></span>
                            </UserProfileMenu>
                        </div>
                        <div style={{float:"right"}} ref="notifications" className="hidden-xs dropdown right-dropdown">
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
                </div>
            </nav>
        </div>
        
    )}
});