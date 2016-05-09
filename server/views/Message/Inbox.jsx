import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

Inbox = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var inbox, messages;
        inbox = this.props.for;
        if(inbox) {
            messages = inbox.getMessages();
        }
        return {
            inbox:inbox,
            messages:messages||[]
        }
    },

    render(){
        var inbox = this.data.inbox;
        var messages = this.data.messages;
        return (
            <div className="feed-activity-list">
                {messages.map(function(message,idx){
                    return (
                        <div key={message._id} className="feed-element">
                            <MessageView item={message}/>
                        </div>
                    )
                })}
            
                <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                    <MessageView inbox={inbox}/>
                </div>
            
            </div>
        )
    }
})