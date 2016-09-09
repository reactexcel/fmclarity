import React from "react";

/* to be expanded and made into component that can also support FAB */
export default class Menu extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			items: props.items,
			itemCount: props.items ? props.items.length : 0,
			icon: props.icon || "ellipsis-v",
		}
	}

	componentWillReceiveProps( props ) {
		this.setState( {
			items: props.items,
			itemCount: props.items ? props.items.length : 0
		} )
	}

	runAction( item, event ) {
		if ( item.shouldConfirm ) {
			var message = confirm( item.label + ". Are you sure?" );
			if ( message != true ) {
				return;
			}
		}
		item.action( event );
	}

	render() {
		if ( !( this.state.itemCount ) ) {
			return <div/>
		}
		return (
			<div>
				<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
					<i className={"fa fa-"+this.state.icon}></i>
				</a>
				<ul className="dropdown-menu">
		    		{this.state.items.map((i,idx)=>(
		    			<li key={idx} onClick={()=>this.runAction(i)}><a>{i.label}</a></li>
		    		))}
				</ul>
			</div>
		)
	}
}
