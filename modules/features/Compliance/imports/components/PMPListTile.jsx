import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { ContactCard } from '/modules/mixins/Members';
import { RequestActions } from '/modules/models/Requests';
import moment from "moment";

const PMPListTile = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let request = this.props.item,
            supplier = null,
            dueDate = null,
            nextRequest = null,
            previousRequest = null;

        if ( request ) {
            supplier = request.supplier;
            nextDate = request.getNextDate();
            previousDate = request.getPreviousDate();
            nextRequest = request.findCloneAt( nextDate );
            previousRequest = request.findCloneAt( previousDate );
        }
        return { request, supplier, nextDate, previousDate, nextRequest, previousRequest };
    },

    render() {

        let { request, supplier, nextDate, previousDate, nextRequest, previousRequest } = this.data,
            nextDateString = null,
            frequency = request.frequency || {},
            previousDateString = null;

        if( nextDate ) {
            nextDateString = moment( nextDate ).format('ddd Do MMM');
        }
        if( previousDate ) {
            previousDateString = moment( previousDate ).format('ddd Do MMM');
        }


        return <div className = { "issue-summary" }>
            <div className = "issue-summary-col" style = { {float:"right",width:"25%",padding:"0px"} }>
                <ContactCard item = { supplier }/>
            </div>
            <div className = "issue-summary-col" style = { {width:"20%"} } onClick = { () => { RequestActions.view.run( request ) } }>
                { request.name }
            </div>
            <div className = "issue-summary-col" style = {{width:"10%"}}>
                due every {`${frequency.number||''} ${frequency.unit||''}`}
            </div>
            <div className = "issue-summary-col" style = {{width:"20%"}}>
                { previousDateString && previousRequest ?
                    <span onClick = { () => { previousRequest ? RequestActions.view.run( previousRequest ) : RequestActions.view.run( request ) } } >
                        <span>previous <b>{ previousDateString }</b> </span>
                        { previousRequest ?
                            <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status } { previousRequest.getTimeliness() }</span>
                        : null }
                    </span>
                : null }
            </div>
            <div className = "issue-summary-col" style = {{width:"20%"}}>
                { nextDateString && nextRequest ?
                    <span onClick = { () => { nextRequest ? RequestActions.view.run( nextRequest ) : RequestActions.view.run( request ) } } >
                        <span>next due <b>{ nextDateString }</b> </span>
                        { nextRequest ?
                            <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status } { nextRequest.getTimeliness() }</span>
                        : null }
                    </span>
                : null }
            </div>
        </div>
    }

} );

export default PMPListTile;
