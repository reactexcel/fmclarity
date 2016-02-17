

Navigation = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var user, team, modules;
        user = Meteor.user();
        team = FM.getSelectedTeam();
        if(team) {
            modules = team.modules;
        }
        return {
            team:team,
            modules:modules||{}
        }
    },

    onMenuClick() {
        $(".body-small").toggleClass("mini-navbar");
    },

    render() {
        var modules = this.data.modules;

    return (
    <nav className="navbar-static-side">
        <div className="sidebar-collapse">

            {/*nope - this should be data driven
            perhaps even database driven*/}
            <ul className="nav metismenu" id="side-menu" onClick={this.onMenuClick}>
                {!modules['Dashboard']?null:
                <li className={FlowRouter.getRouteName()=='dashboard'?'active':''}>
                    <a href={FlowRouter.path('dashboard')}>
                        <i className="fa fa-newspaper-o"></i>
                        <span className="nav-label">Dashboard</span>
                    </a>
                </li>
                }
                {!modules['Portfolio']?null:
                <li className={FlowRouter.getRouteName()=='portfolio'?'active':''}>
                    <a href={FlowRouter.path('portfolio')}>
                        <i className="fa fa-building"></i>
                        <span className="nav-label">Portfolio</span>
                    </a>
                </li>
                }
                {!modules['Suppliers']?null:
                <li className={FlowRouter.getRouteName()=='suppliers'?'active':''}>
                    <a href={FlowRouter.path('suppliers')}>
                        <i className="fa fa-group"></i>
                        <span className="nav-label">Suppliers</span>
                    </a>
                </li>
                }
                {!modules['Repairs']?null:
                <li className={FlowRouter.getRouteName()=='requests'?'active':''}>
                    <a href={FlowRouter.path('requests')}>
                        <i className="fa fa-wrench"></i>
                        <span className="nav-label">Requests</span>
                    </a>
                </li>
                }
                {!modules['PMP']?null:
                <li className={FlowRouter.getRouteName()=='pmp'?'active':''}>
                    <a href={FlowRouter.path('pmp')}>
                        <i className="fa fa-calendar"></i>
                        <span className="nav-label">Maintenence</span>
                    </a>
                </li>
                }
                {!modules['ABC']?null:
                <li className={FlowRouter.getRouteName()=='abc'?'active':''}>
                    <a href={FlowRouter.path('abc')}>
                        <i className="fa fa-check-square"></i>
                        <span className="nav-label">Compliance</span>
                    </a>
                </li>
                }
                {!modules['Sustainability']?null:
                <li className={FlowRouter.getRouteName()=='sustainability'?'active':''}>
                    <a href={FlowRouter.path('sustainability')}>
                        <i className="fa fa-leaf"></i>
                        <span className="nav-label">Sustainability</span>
                    </a>
                </li>
                }
                {!modules['Contracts']?null:
                <li className={FlowRouter.getRouteName()=='contracts'?'active':''}>
                    <a href={FlowRouter.path('contracts')}>
                        <i className="fa fa-file-text-o"></i>
                        <span className="nav-label">Contracts</span>
                    </a>
                </li>
                }
                {!modules['Reports']?null:
                <li className={FlowRouter.getRouteName()=='reports'?'active':''}>
                    <a href={FlowRouter.path('reports')}>
                        <i className="fa fa-bar-chart-o"></i>
                        <span className="nav-label">Reports</span>
                    </a>
                </li>
                }
                {/*
                <li className={FlowRouter.getRouteName()=='messages'?'active':''}>
                    <a href={FlowRouter.path('messages')}>
                        <i className="fa fa-envelope"></i>
                        <span className="nav-label">Messages</span>
                    </a>
                </li>
                <li className={FlowRouter.getRouteName()=='account'?'active':''}>
                    <a href={FlowRouter.path('account')}>
                        <i className="fa fa-cog"></i>
                        <span className="nav-label">Account</span>
                    </a>
                </li>
                <li className={FlowRouter.getRouteName()=='team'?'active':''}>
                    <a href={FlowRouter.path('team')}>
                        <i className="fa fa-cog"></i>
                        <span className="nav-label">Team</span>
                    </a>
                </li>
                <li className={FlowRouter.getRouteName()=='profile'?'active':''}>
                    <a href={FlowRouter.path('profile')}>
                        <i className="fa fa-cog"></i>
                        <span className="nav-label">Profile</span>
                    </a>
                </li>
                */}
            </ul>
        </div>
    </nav>
);}});
