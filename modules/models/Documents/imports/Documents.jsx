/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';
import { Owners } from '/modules/mixins/Owners';
import { DocMessages } from '/modules/models/Messages';
import { Members } from '/modules/mixins/Members';

import DocumentSchema from './schemas/DocumentSchema.jsx';

/**
 * @memberOf		module:models/Documents
 */

const Documents = new Model( {
	schema: DocumentSchema,
	collection: "Files",
	mixins: [
		[ Owners ],
		[ DocMessages, {
			helpers: {
				getInboxName() {
					return "document #" + this.documentNumber + ' "' + this.getName() + '"';
				},
				getWatchers() {
					let facility = Session.getSelectedFacility(),
						recipients = [],
						recipientsArray = recipients.concat( facility?facility.getMembers( {
							                role: "portfolio manager"
							            } ):[] );
					return  recipientsArray;
				}
			}
		} ],
		[ Members ]
	]
} )

if ( Meteor.isServer ) {
	Meteor.publish( 'Documents', () => {
		return Documents.find();
	} );
}

Documents.collection.allow( {
	remove: () => {
		return true;
	},
	update: () => {
		return true;
	}
} )

if( Meteor.isServer ) {
	Documents.collection._ensureIndex( { 'team._id': 1 } );
	Documents.collection._ensureIndex( { 'facility._id': 1 } );
	Documents.collection._ensureIndex( { 'request._id': 1 } );
}

Documents.actions( {
	destroy: {
		authentication: true,
		helper: ( doc ) => {
			let attachments = doc.attachments;

			import { Files } from '/modules/models/Files';

			_.forEach( attachments, ( attach ) => {
				Files.remove( { _id: attach._id } );
			} );
			if ( doc ) {
				let owner = null;
				if( doc.owner ) {
					owner = doc.getOwner();
				}
				doc.distributeMessage( {
					message: {
						verb: "deleted",
						subject: "A document has been deleted" + ( owner ? ` by ${owner.getName()}` : '' ),
						body: doc.description
					}
		} );
			}
			Documents.remove( { _id: doc._id } );
		}
	},
	makePrivate: {
		authentication: true,
		helper: ( doc, private ) => {
			Documents.update( { _id: doc._id },{ $set: { "private": private } } )
		}
	},
} )
export default Documents;
