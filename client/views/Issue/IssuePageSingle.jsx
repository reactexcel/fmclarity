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
        return {
        	issue:Issues.findOne(id)
        }
    },

    render() {
        var issue = this.data.issue;
        if(!issue) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3>{issue.team.name}<br/>Work Request #{issue.code}</h3>
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