import { Action } from '/modules/core/Actions';

import { Documents } from '/modules/models/Documents';
import { Facilities } from '/modules/models/Facilities';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';

import moment from 'moment';


function getMessagesThisHour() {

	import { Messages } from '/modules/models/Messages';

	let oneHourAgo = moment().subtract( 1, 'day' );

	console.log( oneHourAgo.toDate() );

	let messages = Messages.findAll( { 
		'inboxId.query._id': Meteor.user()._id,
		createdAt: {
			$gte: oneHourAgo.toDate()
		}
	} );

	return messages;
}

function bundleMessages( messages ) {
	if( !_.isArray( messages ) ) {
		throw new Meteor.Error( 'Messages should not be an array' );
	}
	let bundledMessages = _.groupBy( messages, 'verb' );
	console.log( bundledMessages );
	return bundledMessages;
}

function sendEmail() {

}

const sendEmailDigests = new Action( { 
	name: 'send email digests',
	label: 'Send email digests',
	icon: 'fa fa-exclamation',
	action: () => {
		let messages = getMessagesThisHour();
		let bundledMessages = bundleMessages( messages );
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
