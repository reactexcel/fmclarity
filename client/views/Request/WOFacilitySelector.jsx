IssueFacilitySelector = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue, team, facility, area, teamFacilities, facilityAreas;
        issue = this.props.issue;
        if(issue) {
            team = issue.getTeam();
            if(team) {
                teamFacilities = team.getFacilities();
            }
            facility = issue.getFacility();
            if(facility) {
                area = issue.getArea();
                facilityAreas = facility.getAreas();
            }
        }
        return {
            teamFacilities:teamFacilities,
            selectedFacility:facility,
            facilityAreas:facilityAreas,
            selectedArea:area,
        }
    },

    handleChange(field,value) {
        this.props.issue[field] = value;
        this.props.issue.save();
    },

    render() {
        var issue = this.props.issue;
        var facility = this.data.selectedFacility;
        var area = this.data.selectedArea;
        return (
            <div className="row">
            <div className="col-lg-12">
                <SuperSelect 
                    readOnly={!issue.canSetFacility()}
                    items={this.data.teamFacilities} 
                    itemView={ContactViewName}
                    onChange={issue.setFacility.bind(issue)}
                >
                    <span className="issue-summary-facility-col">
                        {facility?<span>{facility.getName()} -</span>:<span style={{color:"#999"}}>Select facility</span>}
                    </span>
                </SuperSelect>
            </div>
            {/*
            <div className="col-lg-6">
                {facility&&issue.canSetArea()?
                <SuperSelect 
                    readOnly={!issue.canSetArea()}
                    items={this.data.facilityAreas} 
                    itemView={ContactViewName}
                    onChange={this.handleChange.bind(null,'area')}
                >
                    <span className="issue-summary-facility-col">
                        {area?<span>{area.name}</span>:<span className="active-link-light">Select area</span>}
                    </span>
                </SuperSelect>
                :null}
            </div>
            */}
            </div>
        )
    }
})
