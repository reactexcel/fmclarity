IssuePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
        return {
        	issue:Issues.findOne(this.props.selected)
        }
    },

    render() {
        if(!this.data.issue) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="ibox">
                            	<IssueDetail item={this.data.issue} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})