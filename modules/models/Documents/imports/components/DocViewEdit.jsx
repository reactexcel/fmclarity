/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents';
import DocForm from '../schemas/DocForm.jsx';
/**
 * @class 			DocViewEdit
 * @memberOf 		module:models/Documents
 */
const DocViewEdit = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        var doc = this.props.item || {};
        if ( doc && doc._id ) {
            doc = Documents.findOne( doc._id );
        }
        return {
            doc: doc
        }
    },

    downloadFile() {
        var win = window.open( this.data.url, '_blank' );
        win.focus();
    },

    deleteDoc() {
        var message = confirm( 'Are you sure you want to delete this file?' );
        if ( message == true ) {
            this.data.file.remove();
            this.data.meta.destroy();
            Modal.hide();
            this.props.onChange( null );
        }
    },

    handleChangeCallback( error, item ) {
        if ( !error && this.props.onChange ) {
            this.props.onChange( {
                name: item.name,
                description: item.description,
                type: item.type,
                _id: item._id
            } )
        }
    },

    handleChange( item ) {
        let self = this,
            selectedFacility = Session.getSelectedFacility();
        Modal.hide();
        if ( !item._id ) {
            Documents.save.call( item )
                .then( ( item ) => {
                    console.log( item );
                    if ( self.props.team ) {
                        item.team = {
                            _id: this.props.team._id,
                            name: this.props.team.name
                        };
                        Documents.save.call( item );
                        this.handleChangeCallback( null, item );
                        let newItem = Documents.findOne( item._id );
                        if ( newItem ) {
                            let owner = null;
                            if ( newItem.owner ) {
                                owner = newItem.getOwner();
                            }
                            newItem.distributeMessage( {
                                message: {
                                    verb: "created",
                                    subject: "A new document has been created" + ( owner ? ` by ${owner.getName()}` : '' ),
                                    body: newItem.description
                                }
                            } );
                        }

                    }


                } );
            //	item = Meteor.call( 'Files.create', item, this.handleChangeCallback );
        } else {
            let modelName = this.props.model._name;
            let _id, name;
            if ( modelName == 'Teams' ) {
                let team = this.props.team || Session.getSelectedTeam();
                _id = team._id;
                name = team.name;
                item.team = {
                    _id: _id,
                    name: name
                }
            }
            if ( modelName == 'Facilities' ) {
                let facility = Session.getSelectedFacility();
                _id = facility._id;
                name = facility.name;
                item.facility = {
                    _id: _id,
                    name: name
                }
            }
            if ( modelName == 'Requests' ) {
                let request = this.props.selectedItem;
                _id = request._id;
                name = request.name;
                item.request = {
                    _id: _id,
                    name: name
                }
            }
            Documents.save.call( item );
            if ( item ) {
                let owner = null;
                if ( item.owner ) {
                    owner = item.getOwner();
                }
                item.distributeMessage( {
                    message: {
                        verb: "edited",
                        subject: "A document has been edited" + ( owner ? ` by ${owner.getName()}` : '' ),
                        body: item.description
                    }
                } );
            }
            this.handleChangeCallback( null, item );
        }
    },

    render() {
        return (
            <div style={{padding:"15px"}}>
				<AutoForm
					model 		= { Documents }
					form 		= { DocForm }
					item 		= { this.data.doc }
					onSubmit 	= { this.handleChange  }
				/>
			</div>
        )
    }
} )

export default DocViewEdit;
