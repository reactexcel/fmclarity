
EmailMessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, owner;
        query = this.props.item;
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner();
        }
        return {
            owner:owner,
            inbox:this.props.inbox,
            message:message
        }
    },

    render() {
        var message = this.data.message||{};
        var owner = this.data.owner||Meteor.user();
        var ownerName = owner.getName?owner.getName():'';
        var createdAt = message.createdAt;
        var used = false;
        return(
            <div>
                <div>
                    <p>Hi {owner.getName()},</p>
                    <p>An FM Clarity work order you are involved with has changed. If you were previously emailed an access link, click that link to see the updates. If you have an FM Clarity account <a href={message.getAbsoluteTargetUrl()}>click here</a>.</p>
                </div>

                <div style={{width:"100%",textAlign:"center",backgroundColor:"#0152b5",color:"#fff"}}>
                    <span>Updates</span>
                </div>
                <div className="media-body">
                    {message.body||message.subject||message.verb?
                    <div style={{padding:"20px"}}>
                        <strong>{owner.getName()}</strong> {
                        message.verb?
                            <span>{message.verb} <b><a style={{textDecoration:"none"}} href={message.getAbsoluteTargetUrl()}>{message.getTargetName()}</a></b></span>
                        :
                            <span>{message.subject}</span>
                        }<br/>
                        <div>{message.body}</div>
                        <div><small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small></div>
                    </div>
                    :null}
                </div>
            </div>
        )
    }
});