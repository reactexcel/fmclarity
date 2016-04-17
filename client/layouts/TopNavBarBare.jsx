TopNavBarBare = React.createClass({

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
        $('.navbar-static-top').removeClass('navbar-static-top').addClass('navbar-fixed-top');
        
        var component = this;
        $(this.refs.notifications).on('hidden.bs.dropdown', function () {
            if(component.data.user) {
                component.data.user.markAllNotificationsAsRead();
            }
        })
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
    },

    render() {
        var notifications = this.data.notifications;
        return (
        <div className="row">
            <div className="sidebar-back-screen" onClick={this.toggleLeftSideBar}></div>      
            <nav className="navbar navbar-fixed-top" role="navigation" style={{marginBottom:'0'}}>
                <div className="row">
                    <div className="col-xs-12" style={{textAlign:"left",paddingLeft:"30px"}}>
                        <img style={{width:"160px",margin:"6px"}} src="/img/logo-white.svg"/>
                    </div>
                </div>
            </nav>
        </div>
        
    )}
});