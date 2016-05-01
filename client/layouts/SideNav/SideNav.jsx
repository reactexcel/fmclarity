

Navigation = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        var user,team,role,modules;
        user = Meteor.user();
        team = Session.getSelectedTeam();
        if(team) {
            role = team.getRole(user);
            modules = Config.modules[team.type][role];
        }

        return {
            team:team,
            modules:modules||[]
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
            <ul className="nav metismenu" id="side-menu" onClick={this.onMenuClick}>
            {this.data.modules.map(function(m){
                return (
                    <li key={m.path} className={FlowRouter.getRouteName()==m.path?'active':''}>
                        <a href={FlowRouter.path(m.path)}>
                            <i className={m.icon}></i>
                            <span className="nav-label">{m.label}</span>
                        </a>
                    </li>
                )
            })}
            </ul>
        </div>
    </nav>
);}});
