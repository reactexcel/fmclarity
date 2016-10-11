/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import DocIconHeader from './DocIconHeader.jsx';
import DocIcon from './DocIcon.jsx';

export default function DocExplorer( props ) {

	function handleChange( index, newValue ) {
		Modal.hide();
		if( props.onChange ) {
			props.onChange( documents );
		}
	}
	//get Document list
	function getDocsList() {
		let item = props.item;
		return item.getDocs();
	}

	var documents = getDocsList() //.concat( props.value || [] ) || [];

	return (
		<div>
			<DocIconHeader />
			{ documents.map( ( doc, idx ) => {
			return (
				<DocIcon key = { idx } item = { doc } onChange = { (doc) => { handleChange( idx, doc ) } } model = { props.model } selectedItem={props.item}/>
			)
			})}

			<DocIcon onChange={ (doc) => { handleChange( documents.length, doc ) } } model={props.model}  selectedItem={props.item}/>

		</div>
	)
}
