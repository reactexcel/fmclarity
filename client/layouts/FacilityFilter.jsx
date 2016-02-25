FacilityFilter = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user = Meteor.user();
        if(user) {
            var team = Session.getSelectedTeam();
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
                clearOption={{name:"All facilities"}}
            >
            {
                facility?
                <div style={{whiteSpace:"nowrap"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>{this.props.title} for </span>:null}
                    <span style={{fontSize:"16px",lineHeight:"40px"}} className="nav-label">{facility.getName()} <i className="fa fa-caret-down"></i></span>
                </div>
                :
                <div style={{whiteSpace:"nowrap"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>{this.props.title} for </span>:null}
                    <span style={{fontSize:"16px",lineHeight:"40px"}} className="nav-label">all facilities <i className="fa fa-caret-down"></i></span>
                </div>
            }
            </SuperSelect>
        )}
})