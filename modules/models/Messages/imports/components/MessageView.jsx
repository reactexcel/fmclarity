import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { ContactAvatarSmall } from '/modules/mixins/Members';

import { Messages } from '/modules/models/Messages';

export default MessageView = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let message = null,
            owner = null,
            inbox = this.props.inbox,
            messageIsInContext = false;

        if ( this.props.item && this.props.item._id ) {
            message = Messages.findOne( this.props.item._id );
        }

        if ( message != null ) {
            owner = message.getOwner();
            if ( inbox != null && message.getTargetId() == inbox._id ) {
                messageIsInContext = true;
            }

        }
        return {
            messageIsInContext: messageIsInContext,
            owner: owner,
            inbox: inbox,
            message: message
        }
    },

    componentDidMount() {
        //$(this.refs.input).elastic();
    },

    submit() {
        var input = this.refs.input;
        var owner = Meteor.user();
        var inbox = this.data.inbox;
        var inboxId = inbox.getInboxId();
        Messages.save.call( {
            inboxId,
            type: "comment",
            verb: "commented on",
            subject: owner.getName() + " commented on \"" + inbox.getName() + "\"",
            body: input.value
        } );
        input.value = null;
    },

    handleKeyPress( event ) {
        if ( !event.shiftKey && event.keyCode == 13 ) {
            event.preventDefault();
            this.submit( event );
        }
    },

    render() {
        var message = this.data.message || {};
        var owner = this.data.owner || Meteor.user();
        var createdAt = message.createdAt;
        var used = false; {
            /*if(message.type=="comment") {
                        return (<div>
                            <ContactAvatarSmall item={owner}/>
                            <div className="media-body" style={{paddingLeft:"5px",whiteSpace:"pre-wrap"}}>
                                <div>
                                    <small className="pull-right" style={{color:"#999",marginLeft:"10px"}}>{moment(message.createdAt).fromNow()}</small>
                                    <div style={{width:"90%"}}>
                                        {message.body}
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }
                    else */
        }
        if ( message.body || message.subject || message.verb ) {
            return ( <div>
                <ContactAvatarSmall item={owner}/>
                <div className={"media-body message-type-"+message.type} style={{whiteSpace:"pre-wrap"}}>
                    <div>
                        <small className="message-timestamp pull-right text-muted" style={{marginLeft:"10px"}}>{moment(message.createdAt).fromNow()}</small>
                        {message.type=="comment"&&this.data.messageIsInContext?null:
                        <div className="message-subject">
                            <a style={{fontWeight:"bold"}}>{owner.getName()}</a> {
                            message.verb?
                                <span>{message.verb} <b><a href={message.getTargetUrl()}>{message.getTargetName()}</a></b></span>
                            :
                                <span>{message.subject}</span>
                            }
                        </div>
                        }

                        <div className="message-body">
                            {message.body}
                        </div>

                        <div className="message-footer">
                            <small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>
                        </div>
                    </div>
                </div>
            </div> )
        } else {
            return ( <div>
                <ContactAvatarSmall item={owner}/>
                <div className="media-body">
                    <textarea 
                        ref="input"
                        style={{width:"80%",marginTop:"0px"}}
                        placeholder="Leave a message..."
                        className={"input "+(used?'used':'')}
                        defaultValue={message.body} 
                        onKeyDown={this.handleKeyPress}
                    >
                    </textarea>
                </div>
            </div> )
        }
    }
} );
