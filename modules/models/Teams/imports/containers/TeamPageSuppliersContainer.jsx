/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import { createContainer }  from 'meteor/react-meteor-data';
import TeamPageSuppliers    from '../components/TeamPageSuppliers.jsx';

import { Teams }            from '/modules/models/Teams';
import { Facilities }       from '/modules/models/Facilities';

import { Members }          from '/modules/mixins/Members';

/**
 * @class           TeamPageSuppliersContainer
 * @memberOf        module:models/Teams
 */
const TeamPageSuppliersContainer = createContainer( ( params ) => {

    Meteor.subscribe( 'Teams' );
    Meteor.subscribe( 'Suppliers' );
    Meteor.subscribe( 'Users' );
    Meteor.subscribe( 'Files' );
    Meteor.subscribe( 'Documents' );

    let user = Meteor.user(),
        facility = Session.getSelectedFacility(),
        team = Session.getSelectedTeam(),
        facilities = null,
        suppliers = null;

    if ( team != null ) {
        Meteor.subscribe( 'Facilities', team._id );
        facilities = Facilities.findAll( { 'team._id': team._id } );
    } else if ( user != null ) {
        facilities = user.facilities;
    }

    if ( facility != null ) {
        suppliers = facility.getSuppliers();
        /*suppliers = Members.getMembers( facility, {
            collection: Teams,
            fieldName: 'suppliers'
        } );*/
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
