import React from "react";

export default function Menu( { items, icon = "ellipsis-v" } ) {

	function runAction( item, e ) {
		if ( item.shouldConfirm || item.verb ) {
			if( item.verb.shouldConfirm || item.shouldConfirm ){
				var message = confirm( item.label + ". Are you sure?" );
				if ( message != true ) {
					return;
				}
			}
		}
		item.run( item, e );
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
