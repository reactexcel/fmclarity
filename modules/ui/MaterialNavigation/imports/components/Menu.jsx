import React from "react";
import { TeamActions } from '/modules/models/Teams';

export default function Menu( { items,team, icon = "ellipsis-v" } ) {

	function runAction( item, e ) {
		if ( item.shouldConfirm || item.verb ) {
			if( (item.verb && item.verb.shouldConfirm) || item.shouldConfirm ){
				var message = confirm( item.uniqueAlertLabel ? item.uniqueAlertLabel : item.label + ". Are you sure?" );
				if ( message != true ) {
					return;
				}
			}
		}
		if(item.label === "Edit team"){
					TeamActions.edit.run( team );
		}else if(item.label === "Delete team"){
					TeamActions.destroy.run( team );
		}else{
			item.run( item, e );
		}
	}

	if ( items == null || items.length == 0 ) {
		return <div/>
	}
	return (
		<div className="noprint">
			<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
				<i className={`fa fa-${icon}`}></i>
			</a>
			<ul className="dropdown-menu" style = {{zIndex:"1499"}}>
	    		{ items.map( ( item, idx ) => {

	    			if( item != null ) {
		    			return (
			    			<li key = { idx } onClick={ () => { runAction( item ) } }>
			    				<a>{ item.label }</a>
			    			</li>
			    		)
			    	}
	    		} ) }
			</ul>
		</div>
	)

}
