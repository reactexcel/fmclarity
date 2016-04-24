SupplierRequestEmailView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, request, team, supplier, secret, expiry, token;
        query = this.props.item;
        request = Issues.findOne(query);
        token = this.props.token;
        if(token) {
            secret = token.token;
            expiry = token.expiry;
        }
        return {
            secret:secret,
            expiry:expiry,
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
        var secret = this.data.secret;
        var url;
        if(secret) {
            url = Meteor.absoluteUrl('u/'+ secret + '/' + request.getEncodedPath());
        }
        else {
            url = request.getUrl();
        }
        var dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
        var expiry = this.data.expiry?moment(this.data.expiry).fromNow():null;
        return(
            <div>
                <p>Hi {supplier.getName()},</p>
                <p>{team.getName()} has just issued you a work order <a href={url}>#{request.code} - {request.getName()} at {facility.getName()}</a>.</p>
                <p>The priority is listed as {request.priority} and it is due to be completed by {dueDate}.</p>
                <p>To access full details of the work order, please click the above link (no login required).&nbsp; 
                {expiry?<span>This link will expire {expiry}</span>:null}.
                </p>
                <p>Any comments, images or files can be uploaded to the work order via the above link.</p>
                <p>Please ensure you close out the work order once completed by clicking the close button on the work order. Any additional works required, including a quote if you have it available, can also be added at this time.</p>
                {/*<p>For details of the work order terms and conditions please visit this link [supplier external link].</p>*/}
                <p>Please contact {team.getName()} should you have any queries.</p>
                <p>Best regards,<br/>{team.getName()}</p>
            </div>
        )
    }
});