
EmailMessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, user, owner;
        query = this.props.item;

        user = Users.findOne(this.props.user._id);
        message = Messages.findOne(query);
        if(message) {
            owner = message.getOwner();
        }
        return {
            user:user,
            owner:owner,
            inbox:this.props.inbox,
            message:message
        }
    },

    render() {
        var message = this.data.message||{};
        var owner = this.data.owner;
        var user = this.data.user;
        var userName = (user.profile&&user.profile.firstName)?user.profile.firstName:user.getName()
        var createdAt = message.createdAt;
        return(
            <div>
                <div>
                    <p>Hi {userName},</p>
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