/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents';
import DocForm from '../schemas/DocForm.jsx';
//import { Facilities } from '/modules/models/Facilities';
/**
 * @class           DocViewEdit
 * @memberOf        module:models/Documents
 */
const DocViewEdit = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        var doc = this.props.item || {};
        if ( doc && doc._id ) {
            let facility = doc.facility;
            doc = Documents.findOne( doc._id );
            if (doc) {
                doc["facility"] = Session.getSelectedFacility();
            }
            /*if(!doc.facility){
                doc["facility"] = Facilities.findOne({ _id: facility._id });
            }*/
        }
        return {
            doc: doc
        }
    },

    getInitialState(){
      return {
        isEditable: true,
      };
    },

    componentDidMount( ){
        let doc = this.data.doc,
            isEditable = false,
            isVisible = false;

        //new item is being created
        if( !doc ) {
            isVisible = true;
            isEditable = true;
        }
        else {

            // get user, teams, roles and other relevant data
            import { Teams } from '/modules/models/Teams';

            // check for doc owner id and logged user id
            let user = Meteor.user(),
                team = Session.getSelectedTeam(),
                teamRole = team.getMemberRole( user ),
                facilityRole = null,
                ownerId = doc.owner && doc.owner._id;

            // if the document has a facility specified - evaluate the facility role
            if( doc.facility && doc.facility._id ) {
                import { Facilities } from '/modules/models/Facilities';
                let facility = Facilities.findOne( doc.facility._id );
                facilityRole = facility.getMemberRole( user );
            }

            if( !doc.private || _.contains( doc.visibleTo, teamRole ) || _.contains( [ 'portfolio manager', 'fmc support' ], teamRole ) ) {
                isVisible = true;
            }

            if(
                isVisible && (
                    (ownerId == user._id)
                    || facilityRole == 'manager'
                    || _.contains( [ 'portfolio manager', 'fmc support' ], teamRole )
                    || ( Teams.isServiceTeam( team ) && teamRole == 'manager' )
                )
            )
            {
                isEditable = true;
            }
        }
        this.setState( { isEditable } );
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
        else if(this.props.onChange){
            this.props.onChange(item);
        }
    },

    handleChange( item ) {
        let self = this,
            selectedFacility = Session.getSelectedFacility();
        Modal.hide();
        if ( !item._id ) {
            Documents.save.call( item )
                .then( ( item ) => {
                    if ( self.props.team ) {
                        item.team = {
                            _id: this.props.team._id,
                            name: this.props.team.name
                        };
                        Documents.save.call( item ).then( (doc) => {
                            let savedDoc = Documents.findOne( doc._id );
                            if (savedDoc) {
                                this.handleChangeCallback( null, savedDoc );
                            }
                            else{
                                console.log('document could not be saved');
                            }
                            
                        } );
                        
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
                                    body: newItem.description,
                                    digest: false
                                }
                            } );
                        }

                    } else {
                        this.handleChangeCallback( null, item );
                    }

                } );
            //  item = Meteor.call( 'Files.create', item, this.handleChangeCallback );
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
            if (!item.expiryDate) {
                item.expiryDate = null;
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
                    model       = { Documents }
                    form        = { DocForm }
                    item        = { this.data.doc }
                    onSubmit    = {this.handleChange  }
                    hideSubmit  = { this.state.isEditable ? null : true }
                />
            </div>
        )
    }
} )

export default DocViewEdit;
