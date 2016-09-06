import React from "react";

export default function WorkflowButtons( { item, width = "100px" } ) {
    let actions = item.getActions();

    if ( actions == null && actions.length == 0 ) {
        return (
            <div/>
        )
    }

    return (
        <div>
            {actions.map( (action) => {

                let classes = ['btn','btn-flat'];

                if( !item.checkDoAction( action ) ) {
                    classes.push('disabled');
                }

                if( item.canDoAction( action ) ) 
                {
                    return (

                    <button 
                        key = { action }
                        onClick = { () => { item.doAction(action) } }
                        style = { { width:width } } 
                        type = "button" 
                        className = {classes.join(' ')}>
                        { action }
                    </button>

                    )
                }
            })}
        </div>
    )
}
