import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from '../components/FacilityPageIndex.jsx';

export default FacilityPageIndexContainer = createContainer( ( params ) =>
{
	Meteor.subscribe( 'teamsAndFacilitiesForUser' );
	Meteor.subscribe( 'facilities' );
	Meteor.subscribe( 'users' );
    Meteor.subscribe( 'contractors' );
    Meteor.subscribe( 'documents' );

	let team = Session.getSelectedTeam(),
		facility = Session.getSelectedFacility();

    if ( facility != null )
    {
	    Meteor.subscribe( "messages", "Facilities", facility._id, moment().subtract( { days: 7 } ).toDate() );
    }

	if ( team != null )
	{
		Meteor.subscribe( 'suppliersForTeam', team._id, team.suppliers ? team.suppliers.length : null );
	}

	return {
		team,
		facility
	}
}, FacilityPageIndex);