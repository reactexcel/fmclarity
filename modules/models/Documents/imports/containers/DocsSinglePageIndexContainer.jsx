import { createContainer } from 'meteor/react-meteor-data';
import DocsSinglePageIndex from '../components/DocsSinglePageIndex.jsx';
import { Documents } from '/modules/models/Documents'

export default DocsSinglePageIndexContainer = createContainer( ( params ) => {
  let team = Session.getSelectedTeam(),
    facility = Session.getSelectedFacility(),
    documents = null,
    facilities = [],
    query = { $or: [] };

  if ( facility ){
    query.$or.push( { 'facility._id': facility._id } );
  }
  if( team ){
    if( !facility ){
      facilities = team.getFacilities( { 'team._id': team._id } )
      let ids = _.map(facilities, f => f._id);
      query.$or.push( { "facility._id": { $in: ids } } );
    }
    query.$or.push( { 'team._id': team._id } );
    documents = Documents.findAll( query );
  }

//  console.log( { query, documents } );

	return {
		documents,
    facilities,
    facility,
	}

}, DocsSinglePageIndex );
