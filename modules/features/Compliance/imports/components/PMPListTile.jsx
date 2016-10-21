import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { ContactCard } from '/modules/mixins/Members';

const PMPListTile = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        var request = this.props.item,
            supplier = null;
        if ( request ) {
            supplier = request.supplier;
        }
        return { request, supplier };
    },

    render() {
        var { request, supplier } = this.data;

        return <div className = { "issue-summary" }>
            <div className = "issue-summary-col" style = { {width:"40%"} }>
                { request.name }
            </div>
            <div className = "issue-summary-col" style = {{width:"15%"}}>
                {`${request.frequency.number||''} ${request.frequency.unit||''}`}
            </div>
            <div className = "issue-summary-col" style = { {float:"right",width:"35%",padding:"0px"} }>
                <ContactCard item = { this.data.supplier }/> 
            </div>          
        </div>
    }

} );

export default PMPListTile;