import React from "react";

export default function Menu( { items, icon = "ellipsis-v" } ) {

	function runAction( item, event ) {
		if ( item.shouldConfirm || item.verb.shouldConfirm ) {
			var message = confirm( item.label + ". Are you sure?" );
			if ( message != true ) {
				return;
			}
		}
		item.run( item, event );
	}

	if ( items == null || items.length == 0 ) {
		return <div/>
	}
	return (
		<div>
			<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
				<i className={`fa fa-${icon}`}></i>
			</a>
			<ul className="dropdown-menu">
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
