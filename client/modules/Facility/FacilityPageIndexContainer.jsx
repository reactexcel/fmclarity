import { createContainer } from 'meteor/react-meteor-data';
import FacilityPageIndex from './imports/FacilityPageIndex.jsx';

FacilityPageIndexContainer = createContainer( ( params ) =>
{
	Meteor.subscribe( 'teamsAndFacilitiesForUser' );
	Meteor.subscribe( 'facilities' );
	Meteor.subscribe( 'users' );
    Meteor.subscribe( "contractors" );

	let team 				= Session.getSelectedTeam(),
		facility 			= Session.getSelectedFacility(),
		client 				= Session.getSelectedClient(),
		facilities 			= null,
        facilityContact 	= null,
        facilityCoverImage 	= null;

    if ( facility != null )
    {
	    Meteor.subscribe( "messages", "Facilities", facility._id, moment().subtract( { days: 7 } ).toDate() );

        facilityContact 	= facility.getPrimaryContact();
        facilityCoverImage 	= facility.getThumbUrl();
    }

	if ( team != null )
	{
		Meteor.subscribe( 'suppliersForTeam', team._id, team.suppliers ? team.suppliers.length : null );
		facilities = team.getFacilities();

		if ( client != null )
		{
			//note that the facilities are being filtered after retreival from db
			//this could be employed more widely across the app to improve performance
			//on retrieval of non-sensitive data
			facilities = _.filter( facilities, function( f )
			{
				return (
					( f.team._id == client._id ) ||
					( f.team.name == client.name )
				)
			} )
		}
	}
	return {
		team,
		facility,
		facilityContact,
		facilityCoverImage,
		facilities
	}
}, FacilityPageIndex);