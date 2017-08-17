import React from "react";

import { AutoForm } from '/modules/core/AutoForm';
import PMPListTile from './PMPListTile.jsx';
import { RequestActions } from '/modules/models/Requests';

const PMPGroup = React.createClass({

    render() {
        let self = this;
        var requests = self.props.items;
        return (
            <div>
                {requests&&requests.length?requests.map((req,idx)=>{
                    return (
                        <div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}}>
                            <PMPListTile item={req}/>
                        </div>
                    )
                }):null}
            </div>
        )
    }
})

export default PMPGroup;
