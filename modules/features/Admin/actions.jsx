import { Action } from '/modules/core/Actions';

import { Documents } from '/modules/models/Documents';
import { Facilities } from '/modules/models/Facilities';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';


const sendEmailDigests = new Action( { 
	name: 'send email digests',
	label: 'Send email digests',
	icon: 'fa fa-exclamation',
	action: () => {
		console.log( 'sending email digests' );
	}
} )

const migrate = new Action( {
    name: 'migrate schema',
    label: "Migrate Schema to v0.17",
    icon: 'fa fa-exclamation',
    action: ( ) => {
      
			let facilities, teams, documents;

			documents = Documents.find({}).fetch();
			teams = Teams.find({}).fetch();
			facilities = Facilities.find({}).fetch();

			// Update Documents schema for each facilities ( if doc exists in facilities.documents[] ).
			_.forEach( facilities, ( f ) => {
				if( f.documents ){
					_.forEach( f.documents, ( d ) => {
						let doc = Documents.findOne( d._id );
						if( doc ){
							Documents.update( { _id: d._id }, {
								$set: {
									facility: {
										_id: f._id,
										name: f.name
									}
								}
							})
						}
					})
				}
			})


			// Update Documents schema for each team ( if doc exists in team.documents[] ).
			_.forEach( teams, ( t ) => {
				if( t.documents ){
					_.forEach( t.documents , ( d ) => {
						let doc = Documents.findOne( d._id );
						if( doc ){
							Documents.update( { _id: d._id }, {
								$set: {
									team: {
										_id: t._id,
										name: t.name
									}
								}
							})
						}
					})
				}
			})
  }
} )


export {

	migrate,
	sendEmailDigests

}
