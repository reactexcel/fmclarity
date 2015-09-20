Navigation = React.createClass({

    componentDidMount() {
        // Initialize metisMenu
        $('#side-menu').metisMenu();
    },

    render() {return (
    <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">

            <a className="close-canvas-menu"><i className="fa fa-times"></i></a>

            <ul className="nav metismenu" id="side-menu">
                <li className="nav-header">
                    <div className="dropdown profile-element"> <span>
                            {/*<img alt="image" className="img-circle" src="img/profile_small.jpg" />*/}
                             </span>
                        <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                            <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">{Meteor.user()._id}</strong>
                             </span> <span className="text-muted text-xs block">User email <b className="caret"></b></span> </span> </a>
                        <ul className="dropdown-menu animated fadeInRight m-t-xs">
                            <li><a href="{{pathFor 'profile'}}">Profile</a></li>
                            <li><a href="{{pathFor 'contacts'}}">Contacts</a></li>
                            <li><a href="{{pathFor 'mailbox'}}">Mailbox</a></li>
                            <li className="divider"></li>
                            <li><a href="{{pathFor 'login'}}">Logout</a></li>
                        </ul>
                    </div>
                    <div className="logo-element">
                        IN+
                    </div>
                </li>
                <li className="{{isActiveRoute regex='dashboard1|dashboard2|dashboard3|dashboard4l|dashboard5'}}">
                    <a href="#"><i className="fa fa-th-large"></i> <span className="nav-label">Dashboard</span> <span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='dashboard1|dashboard2|dashboard3|dashboard4l|dashboard5' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='dashboard1'}}"><a href={FlowRouter.path('dashboard1')}>Dashboard v.1</a></li>
                        <li className="{{isActiveRoute regex='dashboard2'}}"><a href="{{pathFor 'dashboard2'}}">Dashboard v.2</a></li>
                        <li className="{{isActiveRoute regex='dashboard3'}}"><a href="{{pathFor 'dashboard3'}}">Dashboard v.3</a></li>
                        <li className="{{isActiveRoute regex='dashboard4l'}}"><a href="{{pathFor 'dashboard4l'}}">Dashboard v.4</a></li>
                        <li className="{{isActiveRoute regex='dashboard5'}}"><a href="{{pathFor 'dashboard5'}}">Dashboard v.5 <span className="label label-primary pull-right">NEW</span></a></li>
                    </ul>
                </li>
                <li className="{{isActiveRoute regex='layouts'}}">
                    <a href="{{pathFor 'layouts'}}"><i className="fa fa-diamond"></i> <span className="nav-label">PMP</span> </a>
                </li>
                <li className="{{isActiveRoute regex='graphFlot|graphMorris|graphRickshaw|graphChartJs|graphPeity|graphSparkline|graphChartist'}}">
                    <a href="#"><i className="fa fa-bar-chart-o"></i> <span className="nav-label">ABC</span><span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='graphFlot|graphMorris|graphRickshaw|graphChartJs|graphPeity|graphSparkline|graphChartist' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='graphFlot'}}"><a href="{{pathFor 'graphFlot'}}">Flot Charts</a></li>
                        <li className="{{isActiveRoute regex='graphRickshaw'}}"><a href="{{pathFor 'graphRickshaw'}}">Rickshaw Charts</a></li>
                        <li className="{{isActiveRoute regex='graphChartJs'}}"><a href="{{pathFor 'graphChartJs'}}">Chart.js</a></li>
                        <li className="{{isActiveRoute regex='graphChartist'}}"><a href="{{pathFor 'graphChartist'}}">Chartist</a></li>
                        <li className="{{isActiveRoute regex='graphPeity'}}"><a href="{{pathFor 'graphPeity'}}">Peity Charts</a></li>
                        <li className="{{isActiveRoute regex='graphSparkline'}}"><a href="{{pathFor 'graphSparkline'}}">Sparkline Charts</a></li>
                    </ul>
                </li>
                <li className="{{isActiveRoute regex='mailbox|emailView|emailCompose|emailTemplates'}}">
                    <a href="#"><i className="fa fa-envelope"></i> <span className="nav-label">Work Requests </span><span className="label label-warning pull-right">16/24</span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='mailbox|emailView|emailCompose|emailTemplates' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='mailbox'}}"><a href="{{pathFor 'mailbox'}}">Inbox</a></li>
                        <li className="{{isActiveRoute regex='emailView'}}"><a href="{{pathFor 'emailView'}}">Email view</a></li>
                        <li className="{{isActiveRoute regex='emailCompose'}}"><a href="{{pathFor 'emailCompose'}}">Compose email</a></li>
                        <li className="{{isActiveRoute regex='emailTemplates'}}"><a href="{{pathFor 'emailTemplates'}}">Email templates</a></li>
                    </ul>
                </li>
                <li className="{{isActiveRoute regex='metrics'}}">
                    <a href="{{pathFor 'metrics'}}"><i className="fa fa-pie-chart"></i> <span className="nav-label">Contracts</span> </a>
                </li>
                <li className="{{isActiveRoute regex='widgets'}}">
                    <a href="{{pathFor 'widgets'}}"><i className="fa fa-flask"></i> <span className="nav-label">Suppliers</span> </a>
                </li>
                <li className="{{isActiveRoute regex='formBasic|formAdvanced|formWizard|formUpload|textEditor'}}">
                    <a href="#"><i className="fa fa-edit"></i> <span className="nav-label">Reports</span><span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='formBasic|formAdvanced|formWizard|formUpload|textEditor' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='formBasic'}}"><a href="{{pathFor 'formBasic'}}">Basic form</a></li>
                        <li className="{{isActiveRoute regex='formAdvanced'}}"><a href="{{pathFor 'formAdvanced'}}">Advanced Plugins</a></li>
                        <li className="{{isActiveRoute regex='formWizard'}}"><a href="{{pathFor 'formWizard'}}">Wizard</a></li>
                        <li className="{{isActiveRoute regex='formUpload'}}"><a href="{{pathFor 'formUpload'}}">File Upload</a></li>
                        <li className="{{isActiveRoute regex='textEditor'}}"><a href="{{pathFor 'textEditor'}}">Text Editor</a></li>
                    </ul>
                </li>
                <li className="{{isActiveRoute regex='contacts2|profile2|voteList|contacts|profile|projects|projectDetail|teamsBoard|clients|fullHeight|fileManager|calendar|issueTracker|blog|article|faq|timelineOne|pinBoard|socialFeed'}}">
                    <a href="#"><i className="fa fa-desktop"></i> <span className="nav-label">Settings</span>  <span className="pull-right label label-primary">SPECIAL</span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='contacts2|profile2|voteList|contacts|profile|projects|projectDetail|teamsBoard|clients|fullHeight|fileManager|Calendar|issueTracker|blog|article|faq|timelineOne|pinBoard|socialFeed' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='contacts'}}"><a href="{{pathFor 'contacts'}}">Contacts</a></li>
                        <li className="{{isActiveRoute regex='profile'}}"><a href="{{pathFor 'profile'}}">Profile</a></li>
                        <li className="{{isActiveRoute regex='profile2'}}"><a href="{{pathFor 'profile2'}}">Profile 2</a></li>
                        <li className="{{isActiveRoute regex='contacts2'}}"><a href="{{pathFor 'contacts2'}}">Contact 2</a></li>
                        <li className="{{isActiveRoute regex='projects'}}"><a href="{{pathFor 'projects'}}">Projects</a></li>
                        <li className="{{isActiveRoute regex='projectDetail'}}"><a href="{{pathFor 'projectDetail'}}">Project detail</a></li>
                        <li className="{{isActiveRoute regex='teamsBoard'}}"><a href="{{pathFor 'teamsBoard'}}">Teams board</a></li>
                        <li className="{{isActiveRoute regex='socialFeed'}}"><a href="{{pathFor 'socialFeed'}}">Social feed</a></li>
                        <li className="{{isActiveRoute regex='clients'}}"><a href="{{pathFor 'clients'}}">Clients</a></li>
                        <li className="{{isActiveRoute regex='fullHeight'}}"><a href="{{pathFor 'fullHeight'}}">Outlook view</a></li>
                        <li className="{{isActiveRoute regex='voteList'}}"><a href="{{pathFor 'voteList'}}">Vote list</a></li>
                        <li className="{{isActiveRoute regex='fileManager'}}"><a href="{{pathFor 'fileManager'}}">File manager</a></li>
                        <li className="{{isActiveRoute regex='calendar'}}"><a href="{{pathFor 'calendar'}}">Calendar</a></li>
                        <li className="{{isActiveRoute regex='issueTracker'}}"><a href="{{pathFor 'issueTracker'}}">Issue tracker</a></li>
                        <li className="{{isActiveRoute regex='blog'}}"><a href="{{pathFor 'blog'}}">Blog</a></li>
                        <li className="{{isActiveRoute regex='article'}}"><a href="{{pathFor 'article'}}">Article</a></li>
                        <li className="{{isActiveRoute regex='faq'}}"><a href="{{pathFor 'faq'}}">FAQ</a></li>
                        <li className="{{isActiveRoute regex='timelineOne'}}"><a href="{{pathFor 'timelineOne'}}">Timeline</a></li>
                        <li className="{{isActiveRoute regex='pinBoard'}}"><a href="{{pathFor 'pinBoard'}}">Pin board</a></li>
                    </ul>
                </li>
                <li className="{{isActiveRoute regex='searchResult|invoice|emptyPage'}}">
                    <a href="#"><i className="fa fa-files-o"></i> <span className="nav-label">Other Pages</span><span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level collapse {{isActiveRoute regex='searchResult|invoice|emptyPage' classNameName='in'}}">
                        <li className="{{isActiveRoute regex='searchResult'}}"><a href="{{pathFor 'searchResult'}}">Search results</a></li>
                        <li><a href="{{pathFor 'lockScreen'}}">Lockscreen</a></li>
                        <li className="{{isActiveRoute regex='invoice'}}"><a href="{{pathFor 'invoice'}}">Invoice</a></li>
                        <li><a href="{{pathFor 'login'}}">Login</a></li>
                        <li><a href="{{pathFor 'loginTwo'}}">Login v.2</a></li>
                        <li><a href="{{pathFor 'forgotPassword'}}">Forgot password</a></li>
                        <li><a href="{{pathFor 'register'}}">Register</a></li>
                        <li><a href="{{pathFor 'errorOne'}}">404 Page</a></li>
                        <li><a href="{{pathFor 'errorTwo'}}">500 Page</a></li>
                        <li className="{{isActiveRoute regex='emptyPage'}}"><a href="{{pathFor 'emptyPage'}}">Empty page</a></li>
                    </ul>
                </li>
                <li >
                    <a href="#"><i className="fa fa-sitemap"></i> <span className="nav-label">Menu Levels </span><span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level">
                        <li>
                            <a href="#">Third Level <span className="fa arrow"></span></a>
                            <ul className="nav nav-third-level">
                                <li>
                                    <a href="#">Third Level Item</a>
                                </li>
                                <li>
                                    <a href="#">Third Level Item</a>
                                </li>
                                <li>
                                    <a href="#">Third Level Item</a>
                                </li>

                            </ul>
                        </li>
                        <li><a href="#">Second Level Item</a></li>
                        <li>
                            <a href="#">Second Level Item</a></li>
                        <li>
                            <a href="#">Second Level Item</a></li>
                    </ul>
                </li>
            </ul>

        </div>
    </nav>
);}});
