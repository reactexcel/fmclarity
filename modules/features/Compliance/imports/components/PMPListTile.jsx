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
            nextRequest = request.getNextRequest();
            previousRequest = request.getPreviousRequest();
        }
        return { request, supplier, previousRequest, nextRequest };
    },

    render() {

        let { request, supplier, nextRequest, previousRequest } = this.data,
            nextDateString = null,
            previousDateString = null;

        if( nextRequest ) {
            nextDateString = moment( nextRequest.dueDate ).format('ddd Do MMM');
        }
        if( previousRequest ) {
            previousDateString = moment( previousRequest.dueDate ).format('ddd Do MMM');
        }


        return <div className = { "issue-summary" }>
            <div className = "issue-summary-col" style = { {float:"right",width:"35%",padding:"0px"} }>
                <ContactCard item = { supplier }/> 
            </div>          
            <div className = "issue-summary-col" style = { {width:"20%"} } onClick = { () => { RequestActions.view.run( request ) } }>
                { request.name }
            </div>
            <div className = "issue-summary-col" style = {{width:"15%"}}>
                due every {`${request.frequency.number||''} ${request.frequency.unit||''}`}
            </div>
            <div className = "issue-summary-col" style = {{width:"15%"}}>
                { nextDateString ? 
                    <span onClick = { () => { RequestActions.view.run( nextRequest ) } } >
                        <span>next due <b>{ nextDateString }</b> </span>
                        <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status }</span>
                    </span> 
                : null }
            </div>
            <div className = "issue-summary-col" style = {{width:"15%"}}>
                { previousDateString ? 
                    <span onClick = { () => { RequestActions.view.run( previousRequest ) } } >
                        <span>previous <b>{ previousDateString }</b> </span>
                        <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status }</span>
                    </span> 
                : null }
            </div>
        </div>
    }

} );

export default PMPListTile;