/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { createContainer } from 'meteor/react-meteor-data';
import TeamPageSuppliers from '../components/TeamPageSuppliers.jsx';

import { Teams } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';

import { Members } from '/modules/mixins/Members';

/**
 * @class           TeamPageSuppliersContainer
 * @memberOf        module:models/Teams
 */
const TeamPageSuppliersContainer = createContainer( ( params ) => {

    Meteor.subscribe( 'User: Facilities, Requests' );

    let user = Meteor.user(),
        facility = Session.getSelectedFacility(),
        team = Session.getSelectedTeam(),
        facilities = null,
        suppliers = null;

    if ( team != null ) {
        facilities = Facilities.findAll( { 'team._id': team._id } );
    } else if ( user != null ) {
        facilities = user.facilities;
    }
    if ( facilities ) {
        let facilityThumbs = _.pluck( facilities, 'thumb' );
        Meteor.subscribe( 'Thumbs', facilityThumbs );
    }


    if ( facility != null ) {
        suppliers = facility.getSuppliers();
        /*suppliers = Members.getMembers( facility, {
            collection: Teams,
            fieldName: 'suppliers'
        } );*/
    } else if( facilities && facilities.length ) {
        let supplierIds = [],
            supplierNames = [];

        facilities.map( ( facility ) => {
            let services = facility.servicesRequired || [];
            services.map( ( service ) => {
                if( service.data && service.data.supplier ) {
                    supplierIds.push( service.data.supplier._id );
                    supplierNames.push( service.data.supplier.name );
                }
                if( service.children ) {
                    service.children.map( ( subservice ) => {
                        if( subservice.data && subservice.data.supplier ) {
                            supplierIds.push( subservice.data.supplier._id );
                            supplierNames.push( subservice.data.supplier.name );
                        }
                    } )
                }
            } )
        } );

        supplierIds = _.uniq( supplierIds );

        suppliers = Teams.find( 
            { $or : [
                { _id: { $in: supplierIds } },
                { name: { $in: supplierNames } },
            ] },
            { sort: { name: 1 } }
        ).fetch();

        suppliers = _.uniq( suppliers, false, ( i ) => {
            return i._id;
        } );        
    }

    return {
        user,
        team,
        facility,
        facilities,
        suppliers
    }

}, TeamPageSuppliers );

export default TeamPageSuppliersContainer;
