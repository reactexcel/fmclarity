Notifications = React.createClass({

    render() {
        return (
                <li className="dropdown">
                    <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                        <i className="fa fa-bell"></i>  <span className="label label-warning">3</span>
                    </a>
                    <ul className="dropdown-menu dropdown-messages">
                        <li>
                            <div className="dropdown-messages-box">
                                <a href="{{pathFor route='profile'}}" className="pull-left">
                                    <img alt="image" className="img-circle" src="img/a7.jpg"/>
                                </a>
                                <div className="media-body">
                                    <small className="pull-right">46h ago</small>
                                    <strong>Mike Loreipsum</strong> started following <strong>Monica Smith</strong>. <br/>
                                    <small className="text-muted">3 days ago at 7:58 pm - 10.06.2014</small>
                                </div>
                            </div>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="dropdown-messages-box">
                                <a href="{{pathFor route='profile'}}" className="pull-left">
                                    <img alt="image" className="img-circle" src="img/a4.jpg"/>
                                </a>
                                <div className="media-body ">
                                    <small className="pull-right text-navy">5h ago</small>
                                    <strong>Chris Johnatan Overtunk</strong> started following <strong>Monica Smith</strong>. <br/>
                                    <small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
                                </div>
                            </div>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="dropdown-messages-box">
                                <a href="{{pathFor route='profile'}}" className="pull-left">
                                    <img alt="image" className="img-circle" src="img/profile.jpg"/>
                                </a>
                                <div className="media-body ">
                                    <small className="pull-right">23h ago</small>
                                    <strong>Monica Smith</strong> love <strong>Kim Smith</strong>. <br/>
                                    <small className="text-muted">2 days ago at 2:30 am - 11.06.2014</small>
                                </div>
                            </div>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="text-center link-block">
                                <a href="{{pathFor route='mailbox'}}">
                                    <i className="fa fa-bell"></i> <strong>See All Notifications</strong>
                                </a>
                            </div>
                        </li>
                    </ul>
                </li>

        )
    }
});

TopNavBar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var user, team, teams;
        user = Meteor.user();
        if(user) {
            team = user.getSelectedTeam();
            teams = user.getTeams();
        }
        return {
            user:user,
            team:team,
            teams:teams
        }
    },

    componentDidMount() {
        $('body').addClass('fixed-nav');
        $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
        this.smoothlyMenu();
    },

    selectTeam(team) {
        Meteor.user().selectTeam(team);
    },


    smoothlyMenu() {
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 300);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    },

    toggleRightSideBar() {
        $('#right-sidebar').toggleClass("sidebar-open");
    },    

    render() {
        if(!this.data.user||!this.data.team) {
            return <div/>
        }
        var userEmail = Meteor.user()&&Meteor.user().emails?Meteor.user().emails[0].address:'';
        var userThumb = Meteor.user()?Meteor.user().profile.thumb:'';
        var setTeam = this.selectTeam;
        var selectedTeam = this.data.team;
        return (

    <div className="row border-bottom">
        <nav className="navbar navbar-fixed-top" role="navigation" style={{marginBottom:'0'}}>
            <div className="navbar-header navbar-logo">
                <img width="190px" src="img/logo-white.svg"/>
            </div>
            <div className="navbar-header">
                <a id="navbar-minimalize" onClick={this.toggleLeftSideBar} className="minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i> </a>
            </div>
            <ul className="nav navbar-top-links navbar-right">
                {/*
                <li>
                    <a onClick={this.toggleRightSideBar} className="right-sidebar-toggle">
                        <i className="fa fa-tasks"></i>
                    </a>
                </li>
                */}
                <li className="dropdown">
                    <a style={{padding:"8px"}} className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                        {/*<img style={{width:"40px"}} alt="image" className="img-circle" src="img/profile-nothumb.png" />*/}
                        <span style={{marginRight:"10px"}}>{selectedTeam.name}</span>
                        <img style={{width:"40px"}} alt="image" className="img-circle" src={"img/"+userThumb} />
                    </a>
                    <ul className="dropdown-menu dropdown-alerts" style={{right:"-5px"}}>
                        <li>
                            <a href={FlowRouter.path('profile')}>
                                <div>
                                    Logged in as: <b>{userEmail}</b>
                                </div>
                            </a>
                        </li>
                        <li className="divider"></li>
                        {this.data.teams.map(function(team){
                            return (
                                <li key={team._id} className={team.name==selectedTeam.name?"active":''} onClick={setTeam.bind(null,team)}>
                                    <a>{team.name}</a>
                                </li>
                            )
                        })}
                        <li className="divider"></li>
                        <li>
                            <a href="{{pathFor route='mailbox'}}">
                                <div>
                                    <i className="fa fa-envelope fa-fw"></i> You have 16 messages
                                    <span className="pull-right text-muted small">4 minutes ago</span>
                                </div>
                            </a>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <a href="{{pathFor route='profile'}}">
                                <div>
                                    <i className="fa fa-twitter fa-fw"></i> 3 New Followers
                                    <span className="pull-right text-muted small">12 minutes ago</span>
                                </div>
                            </a>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <a href="{{pathFor route='gridOptions'}}">
                                <div>
                                    <i className="fa fa-upload fa-fw"></i> Server Rebooted
                                    <span className="pull-right text-muted small">4 minutes ago</span>
                                </div>
                            </a>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="text-center link-block">
                                <a href={FlowRouter.path('logout')}>
                                    <i className="fa fa-sign-out"></i> Log out
                                </a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
);}});