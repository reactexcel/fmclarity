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
        var request, facility, dueDate;
        request = Issues.findOne(id);
        if(request) {
            facility = request.getFacility();
            dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
        }
        return {
        	request:request,
            dueDate:dueDate,
            facility:facility
        }
    },

    render() {
        var request = this.data.request;
        var facility = this.data.facility;
        var dueDate = this.data.dueDate;
        if(!request) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3>{request.team.name}<br/>
                            Work Request #{request.code}<br/>
                            {facility.getAddress()}<br/>
                            Due {dueDate}</h3>
                        </div>
                        <div className="col-xs-12">
                            <div className="ibox">
                            	<IssueDetail item={request} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})