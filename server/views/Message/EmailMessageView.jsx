
EmailMessageView = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, message, creator;
        query = this.props.item;
        message = Posts.findOne(query);
        if(message) {
            creator = message.getCreator()
        }
        return {
            creator:creator,
            inbox:this.props.inbox,
            message:message
        }
    },

    render() {
        var message = this.data.message||{};
        var creator = this.data.creator||Meteor.user();
        var createdAt = message.createdAt;
        var used = false;
        return(
            <div>
                <div style={{width:"100%",height:"50px",textAlign:"center",backgroundColor:"#0152b5",color:"#fff"}}>
                    <span style={{fontSize:"20px",lineHeight:"45px"}}>FM Clarity</span>
                </div>
                <div style={{width:"100%",textAlign:"center",backgroundColor:"#ddd",color:"#333"}}>
                    <span>An FM Clarity work request you are watching has changed...</span>
                </div>
                <div className="media-body">
                    {message.body||message.subject||message.verb?
                    <div style={{padding:"20px"}}>
                        <strong>{creator.getName()}</strong> {
                        message.verb?
                            <span>{message.verb} <b><a style={{textDecoration:"none"}} href={message.getAbsoluteTargetUrl()}>{message.getTargetName()}</a></b></span>
                        :
                            <span>{message.subject}</span>
                        }<br/>
                        <div>{message.body}</div>
                    </div>
                    :null}
                </div>
            </div>
        )
    }
});