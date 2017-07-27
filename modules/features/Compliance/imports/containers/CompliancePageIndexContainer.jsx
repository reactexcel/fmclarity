/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import { createContainer } from 'meteor/react-meteor-data';
import CompliancePageIndex from '../components/CompliancePageIndex.jsx';
import { Facilities } from '/modules/models/Facilities';

/**
 * @class 			CompliancePageIndexContainer
 * @memberOf		module:features/Compliance
 */
const CompliancePageIndexContainer = createContainer( ( { params } ) => {

	let facility = Session.getSelectedFacility(),
		team = Session.getSelectedTeam(),
		facilities = null,
		services = null;

	if ( team ) {
		facilities = Facilities.findAll( { 'team._id': team._id } );
	}

	if ( facility ) {
    console.log(facility);
		services = _.filter( facility.servicesRequired, ( service ) => {
			return ( service && service.data && service.data.complianceRules && service.data.complianceRules.length )
		} );
	}

	return {
		facility,
		team,
		facilities,
		services
	}

}, CompliancePageIndex );

export default CompliancePageIndexContainer;
