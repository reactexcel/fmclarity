import React from "react";

import { AutoForm } from '/modules/core/AutoForm';
import PMPListTile from './PMPListTile.jsx';

const PMPGroup = React.createClass({

    showModal(request) {
        //Need a width option for modals before this can be instantiated
        request.type = "Preventative";
        Modal.show({
            content:<AutoForm 
                item={request} 
                form={Requests.forms.create}
            >            
                <h2>Edit Preventative Maintenence Event</h2>
            </AutoForm>,
            size:"large"
        })
    },

    render() {
        var requests = this.props.items;
        return (
            <div>
                {requests&&requests.length?requests.map((r,idx)=>{
                    return (
                        <div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}} onClick={()=>{FABActions.viewRequest(r)}}>
                            <PMPListTile item={r}/>
                        </div>
                    )
                }):null}
            </div>
        )
    }
})

export default PMPGroup;