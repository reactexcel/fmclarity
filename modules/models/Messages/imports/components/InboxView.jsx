import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import MessageView from './MessageView.jsx';

export default Inbox = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {

        var inbox, messages;
        inbox = this.props.for;
        if ( inbox ) {
            messages = inbox.getMessages( this.props.options );
        }
        return {
            inbox: inbox,
            messages: messages || []
        }
    },

    getInitialState() {
        return {
            truncate: this.props.truncate || false,
            stepper: 5
        }
    },

    untruncate() {
        this.setState( { stepper: this.state.stepper +5 } );
    },

    render() {

        let inbox = this.data.inbox,
            messages = this.data.messages,
            readOnly = this.props.readOnly,
            truncated = this.state.truncate,
            numberTruncated = messages.length - this.state.stepper,
            currentStepper = this.state.stepper,
            loadNumber = numberTruncated > 5 ? 5 : messages.length % 5;

        return (
            <div className="feed-activity-list">


                { truncated && numberTruncated > 0 ?
                <div onClick = { this.untruncate } className = "feed-element" style = { {textAlign:"center",backgroundColor:"#f6f6f6",color:"#aaa",padding:"0px",cursor:"pointer"} }>
                    <small>Show { loadNumber } more item{ loadNumber>1?"s":"" }</small>
                </div>
                : null }

                { messages && messages.length ?

                    messages.map( (message,idx) => {

                        if( idx>messages.length-(currentStepper+1) || !truncated ) {
                            return (
                                <div key = { message._id } className = "feed-element">
                                    <MessageView item = {message} inbox = {inbox}/>
                                </div>
                            )
                        }

                    })

                : null }

                { readOnly ? null :
                <div className="feed-element" style={{borderBottom:"none"}}>
                    <MessageView inbox={inbox}/>
                </div>
                }

            </div>
        )
    }
} )
