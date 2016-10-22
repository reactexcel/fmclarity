import React from "react";
import { Actions } from '/modules/core/Actions';
import WorkflowActions from './WorkflowActions.jsx';

export default function WorkflowButtons( { actions, item, width = "100px" } ) {

    actions = Actions.filter( WorkflowActions, item );

    let actionNames = Object.keys( actions );

    function runAction( action, item ) {
  		if ( action.shouldConfirm ) {
  			var message = confirm( action.label + " request. Are you sure?" );
  			if ( message != true ) {
  				return;
  			}
  		}
  		action.run( item, event );
  	}

    if ( actions == null || actionNames.length == 0 ) {
        return (
            <div/>
        )
    }

    return (
        <div>
            { actionNames.map( ( actionName, idx ) => {

                let action = actions[ actionName ],
                    permitted = ( !action.authenticate || action.authenticate() ),
                    classes = ['btn','btn-flat'];

                if( !permitted ) {
                    classes.push('disabled');
                }

                //console.log(actions);

                return (

                <button
                    key = { idx }
                    onClick = { () => { runAction( action, item ) } }
                    style = { { width:width } }
                    type = "button"
                    className = {classes.join(' ')}>
                    { action.label }
                </button>

                )

            } ) }
        </div>
    )
}
