IssuePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var id = this.props.selected;
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('facilities');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
        Meteor.subscribe('singleRequest',id);
        Meteor.subscribe('allTeams');
        var issue, facility;
        issue = Issues.findOne(id);
        if(issue) {
            facility = issue.getFacility();
        }
        return {
        	issue:issue,
            facility:facility
        }
    },

    render() {
        var issue = this.data.issue;
        var facility = this.data.facility;
        if(!issue) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3>{issue.team.name}<br/>
                            Work Request #{issue.code}<br/>
                            {facility.getAddress()}</h3>
                        </div>
                        <div className="col-xs-12">
                            <div className="ibox">
                            	<IssueDetail item={issue} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})