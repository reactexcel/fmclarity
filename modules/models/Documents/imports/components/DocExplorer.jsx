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
			props.onChange( newValue );
		}
	}
	//get Document list
	function getDocsList() {
		let item, keys;
		keys = Object.keys( props.item );
		if( keys.length == 1 ){
			item = props.item [ keys [0] ];
		}else{
			item = props.item;
		}
		return item.getDocs();
	}

	var oldDocumentsList = props.value || [],//getDocsList();//.concat( props.value || [] ) || [];
	  newDocumentsList = getDocsList(),
		listLength = oldDocumentsList.length + newDocumentsList.length;
	return (
		<div>
			<DocIconHeader />
			{//Listing of old Documents
				oldDocumentsList.map( ( doc, idx ) => (
						<DocIcon key = { idx } item = { doc } onChange = { (doc) => { handleChange( idx, doc ) } } model = { props.model } selectedItem = { props.item }/>
					)
				)
			}
			{//Listing of new documents
				newDocumentsList.map( ( doc, idx ) => (
						<DocIcon key = { idx } item = { doc } onChange = { (doc) => { handleChange( idx, doc ) } } model = { props.model } selectedItem = { props.item }/>
					)
				)
			}

			<DocIcon onChange={ (doc) => { handleChange( listLength, doc ) } } model = { props.model }  selectedItem = { props.item }/>

		</div>
	)
}
