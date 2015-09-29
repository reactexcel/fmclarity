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
                <li>
                    <a href="#" style={{padding:"0 0 0 14px",height:"80px"}}>
                        <img style={{width:"40px","paddingBottom":"10px",float:"left","borderRadius":"2px"}} alt="image" src="img/building-1.jpg" />
                        <div style={{"float":"left","fontSize":"12px","lineHeight":"13px","padding":"8px 0 0 5px"}} className="nav-label">463 George St<br/>Northfield</div>
                    </a>
                </li>
                <li className={FlowRouter.getRouteName()=='dashboard'?'active':''}>
                    <a href={FlowRouter.path('dashboard')}><i className="fa fa-newspaper-o"></i> <span className="nav-label">Dashboard</span></a>
                </li>
                <li className={FlowRouter.getRouteName()=='pmp'?'active':''}>
                    <a href={FlowRouter.path('pmp')}><i className="fa fa-calendar"></i> <span className="nav-label">P.M.P.</span><span className="label label-warning pull-right">6</span></a>
                </li>
                <li className={FlowRouter.getRouteName()=='abc'?'active':''}>
                    <a href={FlowRouter.path('abc')}><i className="fa fa-check-square"></i> <span className="nav-label">A.B.C.</span></a>
                </li>
                <li className={FlowRouter.getRouteName()=='requests'?'active':''}>
                    <a href={FlowRouter.path('requests')}><i className="fa fa-wrench"></i> <span className="nav-label">Work Requests</span></a>
                </li>
                <li className={FlowRouter.getRouteName()=='contracts'?'active':''}>
                    <a href={FlowRouter.path('contracts')}><i className="fa fa-file-text-o"></i> <span className="nav-label">Contracts</span> </a>
                </li>
                <li className={FlowRouter.getRouteName()=='suppliers'?'active':''}>
                    <a href={FlowRouter.path('suppliers')}><i className="fa fa-group"></i> <span className="nav-label">Suppliers</span> </a>
                </li>
                <li className={FlowRouter.getRouteName()=='reports'?'active':''}>
                    <a href={FlowRouter.path('reports')}><i className="fa fa-bar-chart-o"></i> <span className="nav-label">Reports</span></a>
                </li>
                <li>
                    <a href=""><i className="fa fa-cog"></i> <span className="nav-label">Settings</span><span className="fa arrow"></span></a>
                    <ul className="nav nav-second-level">
                        <li className={FlowRouter.getRouteName()=='general'?'active':''}>
                            <a href={FlowRouter.path('general')}>General</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='properties'?'active':''}>
                            <a href={FlowRouter.path('properties')}>Properties</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='profile'?'active':''}>
                            <a href={FlowRouter.path('profile')}>Profile</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='contacts'?'active':''}>
                            <a href={FlowRouter.path('contacts')}>Contacts</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='induction'?'active':''}>
                            <a href={FlowRouter.path('induction')}>Induction</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='account'?'active':''}>
                            <a href={FlowRouter.path('account')}>Account</a>
                        </li>
                    </ul>
                </li>
            </ul>

        </div>
    </nav>
);}});
