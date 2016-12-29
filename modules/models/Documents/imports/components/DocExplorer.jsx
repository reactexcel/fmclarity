/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import DocIconHeader from './DocIconHeader.jsx';
import DocIcon from './DocIcon.jsx';

export default class DocExplorer extends React.Component {
  constructor(props) {
    super(props);
		let item, keys;
		keys = Object.keys( props.item );
		if ( keys.length == 1 ) {
			item = props.item[ keys[ 0 ] ];
		} else {
			item = props.item;
		}
		this.state = {
			item: item,
			value: props.value,
		}

  }

	componentWillReceiveProps( props ){
		this.setState( {
			item: props.item,
			//value: props.value,
		} );
	}

	handleChange( index, newValue ) {
		//Modal.hide();
		if ( this.props.onChange ) {
			this.props.onChange( newValue );
		}
		if ( !newValue ){
			//Update the component when a document get deleted.
			this.setState({
				item: this.props.item,
				//value: this.props.value,
			});
		}
	}

  handleListUpdate( doc ) {
			//Update the component when a document get deleted.
      let value =  _.filter( this.state.value, (d) => d._id != doc._id );
			this.setState({
				value: value,
			});
	}

	//get Document list
	getDocsList() {
		return this.state.item.getDocs();
	}

  render() {
		var oldDocumentsList = _.isArray(this.state.value) ? this.state.value : [], //getDocsList();//.concat( props.value || [] ) || [];
			newDocumentsList = this.getDocsList(),
			listLength = oldDocumentsList.length + newDocumentsList.length,
      role = Meteor.user().getRole();
      console.log(role);
    return (
			<div>
				<DocIconHeader />
				{//Listing of old Documents
					oldDocumentsList.map( ( doc, idx ) => (
							<DocIcon
                key = { idx }
                item = { doc }
                onChange = { (doc) => { this.handleChange( idx, doc ) } }
                model = { this.props.model }
                selectedItem = { this.state.item }
                role = { role }
                handleListUpdate={this.handleListUpdate.bind(this)}
                />
						)
					)
				}
				{//Listing of new documents
					newDocumentsList.map( ( doc, idx ) => (
							<DocIcon
                key = { idx }
                item = { doc }
                onChange = { (doc) => { this.handleChange( idx, doc ) } }
                model = { this.props.model }
                selectedItem = { this.state.item }
                role = {role}
                />
						)
					)
				}

				<DocIcon
          onChange={ (doc) => { this.handleChange( listLength, doc ) } }
          model = { this.props.model }
          selectedItem = { this.state.item }
          team = { this.state.item}
          role = {role}
          />

			</div>
		);
  }
}
