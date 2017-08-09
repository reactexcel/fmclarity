import React from "react";

import { AutoForm } from '/modules/core/AutoForm';
import PMPListTile from './PMPListTile.jsx';
import { RequestActions } from '/modules/models/Requests';

const PMPGroup = React.createClass({

    render() {
        var requests = this.props.items;
        return (
            <div>
                {requests&&requests.length?requests.map((r,idx)=>{
                    return (
                        <div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}}>
                            <PMPListTile item={r}/>
                        </div>
                    )
                }):null}
            </div>
        )
    }
})

export default PMPGroup;
