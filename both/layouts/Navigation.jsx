FacilityFilter = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user = Meteor.user();
        if(user) {
            var team = Meteor.user().getSelectedTeam();
            if(team) {
                return {
                    user : user,
                    team : team,
                    facility : user.getSelectedFacility(),
                    facilities : team.getFacilities()
                }
            }
        }
        return {}
    },

    selectFacility(facility) {
        Session.set("selectedFacility",facility);
    },

    render() {
        var facility = this.data.facility;
        return (
            <SuperSelect 
                items={this.data.facilities} 
                itemView={ContactViewName}
                onChange={this.selectFacility}
            >
            {
                facility?
                <div style={{position:"absolute",top:"-14px",left:"-8px",whiteSpace:"nowrap"}}>
                    <img style={{width:"40px",float:"left",display:"inline-block","borderRadius":"2px"}} alt="image" src={"img/"+facility.thumb} />
                    <div style={{"whiteSpace":"normal",width:"165px","display":"inline-block","fontSize":"12px","lineHeight":"13px","padding":"8px 0 0 5px"}} className="nav-label">{facility.name}</div>
                </div>
                :
                <div style={{position:"absolute",top:"-14px",left:"-8px",whiteSpace:"nowrap"}}>
                    <img style={{width:"40px",float:"left",display:"inline-block","borderRadius":"2px"}} alt="image" src={"img/building-undefined.jpg"} />
                    <div style={{"whiteSpace":"normal",width:"165px","display":"inline-block","fontSize":"12px","lineHeight":"13px","padding":"8px 0 0 5px"}} className="nav-label">All facilities<br/>(click to select one)</div>
                </div>
            }
            </SuperSelect>
        )}
})

Navigation = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var user, team, modules;
        user = Meteor.user();
        if(user) {
            team = user.getSelectedTeam();
        }
        if(team) {
            modules = team.modules;
        }
        return {
            team:team,
            modules:modules||{}
        }
    },


    getInitialState() {
        return {
            expanded:true
        }
    },

    componentDidMount() {
        $('#side-menu').metisMenu();
    },

    toggleLeftSideBar() {
        $('body').toggleClass("mini-navbar");
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            $('#side-menu').hide();
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
            $('#side-menu').removeAttr('style');
        }
        this.setState({
            expanded:!this.state.expanded
        })
    },

    render() {
        var modules = this.data.modules;

    return (
    <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">

            <a className="close-canvas-menu"><i className="fa fa-times"></i></a>

                <div style={{position:"relative",top:"20px",left:"20px"}}>
                    <a style={{fontWeight:"normal"}}>
                        <FacilityFilter/>
                    </a>
                </div>

            {/*nope - this should be data driven
            perhaps even database driven*/}
            <ul className="nav metismenu" id="side-menu" style={{marginTop:"55px"}}>
                {!modules['Dashboard']?null:
                <li className={FlowRouter.getRouteName()=='dashboard'?'active':''}>
                    <a href={FlowRouter.path('dashboard')}><i className="fa fa-newspaper-o"></i> <span className="nav-label">Dashboard</span></a>
                </li>
                }
                {!modules['Facilities']?null:
                <li className={FlowRouter.getRouteName()=='facilities'?'active':''}>
                    <a href={FlowRouter.path('facilities')}><i className="fa fa-building"></i> <span className="nav-label">Facilities</span></a>
                </li>
                }
                {!modules['Work Requests']?null:
                <li className={FlowRouter.getRouteName()=='requests'?'active':''}>
                    <a href={FlowRouter.path('requests')}><i className="fa fa-wrench"></i> <span className="nav-label">Work Requests</span></a>
                </li>
                }
                {!modules['Suppliers']?null:
                <li className={FlowRouter.getRouteName()=='suppliers'?'active':''}>
                    <a href={FlowRouter.path('suppliers')}><i className="fa fa-group"></i> <span className="nav-label">Suppliers</span> </a>
                </li>
                }
                {!modules['PMP']?null:
                <li className={FlowRouter.getRouteName()=='pmp'?'active':''}>
                    <a href={FlowRouter.path('pmp')}><i className="fa fa-calendar"></i> <span className="nav-label">P.M.P.</span></a>
                </li>
                }
                {!modules['ABC']?null:
                <li className={FlowRouter.getRouteName()=='abc'?'active':''}>
                    <a href={FlowRouter.path('abc')}><i className="fa fa-check-square"></i> <span className="nav-label">A.B.C.</span></a>
                </li>
                }
                {!modules['Sustainability']?null:
                <li className={FlowRouter.getRouteName()=='sustainability'?'active':''}>
                    <a href={FlowRouter.path('sustainability')}><i className="fa fa-leaf"></i> <span className="nav-label">Sustainability</span> </a>
                </li>
                }
                {!modules['Contracts']?null:
                <li className={FlowRouter.getRouteName()=='contracts'?'active':''}>
                    <a href={FlowRouter.path('contracts')}><i className="fa fa-file-text-o"></i> <span className="nav-label">Contracts</span> </a>
                </li>
                }
                {!modules['Reports']?null:
                <li className={FlowRouter.getRouteName()=='reports'?'active':''}>
                    <a href={FlowRouter.path('reports')}><i className="fa fa-bar-chart-o"></i> <span className="nav-label">Reports</span></a>
                </li>
                }
                <li>
                    <a href=""><i className="fa fa-cog"></i> <span className="nav-label">Settings</span>{/*<span className="fa arrow"></span>*/}</a>
                    <ul className="nav nav-second-level">
                        <li className={FlowRouter.getRouteName()=='account'?'active':''}>
                            <a href={FlowRouter.path('account')}>Account</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='team'?'active':''}>
                            <a href={FlowRouter.path('team')}>Team</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='profile'?'active':''}>
                            <a href={FlowRouter.path('profile')}>Profile</a>
                        </li>
                        {/*
                        <li className={FlowRouter.getRouteName()=='contacts'?'active':''}>
                            <a href={FlowRouter.path('contacts')}>Contacts</a>
                        </li>
                        <li className={FlowRouter.getRouteName()=='induction'?'active':''}>
                            <a href={FlowRouter.path('induction')}>Induction</a>
                        </li>
                        */}
                    </ul>
                </li>
            </ul>
            <a style={{
                position:"absolute",
                right:"-1px",
                fontSize:"20px",
                padding:"0px 5px",
                top:"40%",
                color:"#ccc",
                backgroundColor:"#eee",
                border:"1px solid #eaeaea"
            }} onClick={this.toggleLeftSideBar}><i className="fa fa-ellipsis-v"></i> </a>
            

        </div>
    </nav>
);}});
