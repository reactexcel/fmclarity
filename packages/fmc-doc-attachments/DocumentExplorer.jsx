import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

DocumentExplorer = React.createClass( {

	handleChange( index, newValue ) {
		var documents = this.props.value || [];
		if ( newValue ) {
			documents[ index ] = newValue;
		} else {
			documents.splice( index, 1 );
		}
		//console.log(documents);
		this.props.onChange( documents )
	},

	render() {
		var documents = this.props.value || [];
		return (
			<div>
  			<DocumentIconHeader />
			{documents.map(function(doc,idx){
				return (
					<div key={idx}>
						<DocumentIcon
							item={doc}
							onChange={ () => { this.handleChange( idx ) } }
						/>
					</div>
				)
			})}
			
				<div>
					<DocumentIcon
						onChange={ () => { this.handleChange( documents.length ) } }
					/>
				</div>
			
			</div>
		)
	}
} )
