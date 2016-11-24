import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { ContactCard } from '/modules/mixins/Members';

const PMPListTile = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let request = this.props.item,
            supplier = null,
            dueDate = null;

        if ( request ) {
            supplier = request.supplier;
            dueDate = request.getDueDate();
        }
        return { request, supplier, dueDate };
    },

    render() {
        var { request, supplier, dueDate } = this.data;

        return <div className = { "issue-summary" }>
            <div className = "issue-summary-col" style = { {width:"30%"} }>
                { request.name }
            </div>
            <div className = "issue-summary-col" style = {{width:"12%"}}>
                {`${request.frequency.number||''} ${request.frequency.unit||''}`}
            </div>
            <div className = "issue-summary-col" style = {{width:"12%"}}>
                {dueDate?dueDate:''}
            </div>
            <div className = "issue-summary-col" style = { {float:"right",width:"35%",padding:"0px"} }>
                <ContactCard item = { this.data.supplier }/> 
            </div>          
        </div>
    }

} );

export default PMPListTile;