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

                { inbox.type && _.contains(['Incident'], inbox.type) && inbox.incidentFurtherComments ?
                                    <div>
                                    {inbox.incidentFurtherComments.where ?
                                        <div className="feed-element">
                                        <div style={{borderBottom:"none", paddingLeft:"47px"}}>
                                            <span>How and where are they being treated (if applicable)?</span>&nbsp;
                                            <span className="text-muted">{inbox.incidentFurtherComments && inbox.incidentFurtherComments.where}</span>
                                        </div>
                                    </div>:null}

                                    {inbox.incidentFurtherComments.action ?
                                        <div className="feed-element">
                                        <div style={{borderBottom:"none", paddingLeft:"47px"}}>
                                            <span>What has/is being done?</span>&nbsp;
                                            <span className="text-muted">{inbox.incidentFurtherComments && inbox.incidentFurtherComments.action}</span>
                                        </div>
                                    </div>:null}

                                    {inbox.incidentFurtherComments.furtherAction ?
                                        <div className="feed-element">
                                        <div style={{borderBottom:"none", paddingLeft:"47px"}}>
                                            <span>Further action required</span>&nbsp;
                                            <span className="text-muted">{inbox.incidentFurtherComments && inbox.incidentFurtherComments.furtherAction}</span>
                                        </div>
                                    </div>:null}
                                    </div>

                                    : null
                                    }

                { readOnly ? null :
                <div className="feed-element" style={{borderBottom:"none"}}>
                    <MessageView inbox={inbox}/>
                </div>
                }

            </div>
        )
    }
} )
