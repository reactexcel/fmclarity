import React from "react";
import DocIconHeader from './DocIconHeader.jsx';
import DocIcon from './DocIcon.jsx';

export default DocExplorer = React.createClass( {

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
  			<DocIconHeader />
			{ documents.map( ( doc, idx ) => {
				return (
					<div key={idx}>
						<DocIcon
							item 		= { doc }
							onChange 	= { () => { this.handleChange( idx ) } }
						/>
					</div>
				)
			})}
			
				<div>
					<DocIcon
						onChange={ () => { this.handleChange( documents.length ) } }
					/>
				</div>
			
			</div>
		)
	}
} )
