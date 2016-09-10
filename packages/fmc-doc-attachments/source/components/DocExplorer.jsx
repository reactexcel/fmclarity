import React from "react";
import DocIconHeader from './DocIconHeader.jsx';
import DocIcon from './DocIcon.jsx';

export default function DocExplorer( props ) {

	function handleChange( index, newValue ) {
		var documents = props.value || [];
		if ( newValue ) {
			documents[ index ] = newValue;
		} else {
			documents.splice( index, 1 );
		}
		//console.log(documents);
		props.onChange( documents )
	}

	var documents = props.value || [];
	return (
		<div>
			<DocIconHeader />
			{ documents.map( ( doc, idx ) => {
			return (
				<DocIcon key = { idx } item = { doc } onChange = { () => { handleChange( idx ) } } />
			)
			})}
		
			<DocIcon onChange={ () => { handleChange( documents.length ) } } />
		
		</div>
	)
}
