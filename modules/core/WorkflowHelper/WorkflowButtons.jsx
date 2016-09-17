import React from "react";

export default function WorkflowButtons( { item, width = "100px" } ) {
    let actions = null;//item.getActions();

    if ( actions == null || actions.length == 0 ) {
        return (
            <div/>
        )
    }

    return (
        <div>
            { actions.map( (action) => {

                let permitted = ( !action.authenticate || action.authenticate() ),
                    classes = ['btn','btn-flat'];

                if( !permitted ) {
                    classes.push('disabled');
                }

                return (

                <button 
                    key = { action.name }
                    onClick = { () => { action.run( item ) } }
                    style = { { width:width } } 
                    type = "button" 
                    className = {classes.join(' ')}>
                    { action }
                </button>

                )

            } ) }
        </div>
    )
}
