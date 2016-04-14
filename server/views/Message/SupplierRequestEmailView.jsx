SupplierRequestEmailView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, request, team, supplier;
        query = this.props.item;
        request = Issues.findOne(query);
        return {
            token:this.props.token,
            supplier:request.getSupplier(),
            team:request.getTeam(),
            facility:request.getFacility(),
            request:request,
        }
    },

    render() {
        var team = this.data.team;
        var supplier = this.data.supplier;
        var request = this.data.request;
        var facility = this.data.facility;
        var token = this.data.token;
        var url;
        if(token) {
            url = Meteor.absoluteUrl('t/'+ token + '/' + request.getEncodedPath());
        }
        else {
            url = request.getUrl();
        }
        var dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
        return(
            <div>
                <p>Hi {supplier.getName()},</p>
                <p>{team.getName()} has just issued you a work order <a href={url}>#{request.code} - {request.getName()} at {facility.getName()}</a>.</p>
                <p>The priority is listed as {request.priority} and it is due to be completed by {dueDate}.</p>
                <p>To access full details of the work order, please click <a href={url}>{url}</a> (no login required).</p>
                <p>Any comments, images or files can be uploaded to the work order via the above link.</p>
                <p>Please ensure you close out the work order once completed by clicking the close button on the work order. Any additional works required, including a quote if you have it available, can also be added at this time.</p>
                <p>For details of the work order terms and conditions please visit this link [supplier external link].</p>
                <p>Please contact {team.getName()} should you have any queries.</p>
                <p>Best regards,<br/>{team.getName()}</p>
            </div>
        )
    }
});