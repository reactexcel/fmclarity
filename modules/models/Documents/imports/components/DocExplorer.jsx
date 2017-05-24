/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import PubSub from 'pubsub-js';
import DocIconHeader from './DocIconHeader.jsx';
import DocIcon from './DocIcon.jsx';
import { Documents } from '/modules/models/Documents';

export default class DocExplorer extends React.Component {
    constructor( props ) {
        super( props );
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
            // stopInterval:"false",
            currentDoc:[]
        }

    }
    componentWillMount(){
      let docs = Documents.find({}).fetch();
      let contractDocs = Documents.find({"type":"Contract"}).fetch();
      let aa = contractDocs.filter((doc) => doc.serviceType.hasOwnProperty("name"));

      let docString = " "
      aa.map((d)=>{
        docString = docString + d.name + d.description + d.expiryDate + d.clientExecutedDate + d.supplierExecutedDate + d.totalValue + d.serviceType.name
        if(d.hasOwnProperty("subServiceType")){
          if(d.subServiceType.hasOwnProperty("name")){
            docString = docString + d.subServiceType.name
          }
        }
        if(d.hasOwnProperty("comment")){
            docString = docString + d.comment
        }
      })
      this.setState({currentDoc : docs , docString})

      let test = setInterval(()=>{

        PubSub.subscribe( 'stop', (msg,data) => {
          clearInterval(test)
        } );
        let contractServerDoc = Documents.find({"type":"Contract"}).fetch();
        let aa = contractServerDoc.filter((doc) => doc.serviceType.hasOwnProperty("name"));
        let updatedString = " "
        aa.map((d)=>{
          updatedString = updatedString + d.name + d.description + d.expiryDate + d.clientExecutedDate + d.supplierExecutedDate + d.totalValue + d.serviceType.name
          if(d.hasOwnProperty("subServiceType")){
            if(d.subServiceType.hasOwnProperty("name")){
              updatedString = updatedString + d.subServiceType.name
            }
          }
          if(d.hasOwnProperty("comment")){
  						updatedString = updatedString + d.comment
  				}
        })
        if(updatedString != this.state.docString){
          this.setState({
            docString : updatedString
          })
        }
        let serverDoc = Documents.find({}).fetch();
        if(serverDoc.length != this.state.currentDoc.length){
          this.setState({
            currentDoc : serverDoc
          })
        }
      },1000)
    }

    componentWillUnmount(){
      PubSub.publish('stop', "test");
    }

    componentWillReceiveProps( props ) {
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
        if ( !newValue ) {
            //Update the component when a document get deleted.
            this.setState( {
                item: this.props.item,
                //value: this.props.value,
            } );
        }
    }

    handleListUpdate( doc ) {
        //Update the component when a document get deleted.
        let value = _.filter( this.state.value, ( d ) => d._id != doc._id );
        this.setState( {
            value: value,
        } );
    }

    //get Document list
    getDocsList() {
        return this.state.item.getDocs();
    }

    render() {
        var oldDocumentsList = _.isArray( this.state.value ) ? this.state.value : [], //getDocsList();//.concat( props.value || [] ) || [];
            newDocumentsList = this.getDocsList(),
            listLength = oldDocumentsList.length + newDocumentsList.length,
            role = Meteor.user().getRole();
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
                                team = { this.state.item}
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
                                team = { this.state.item}
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
