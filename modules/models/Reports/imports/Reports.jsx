/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Model } from '/modules/core/ORM';
import { Owners } from '/modules/mixins/Owners';
import { DocMessages } from '/modules/models/Messages';
import { Members } from '/modules/mixins/Members';

import ReportSchema from './schemas/ReportSchema.jsx';

/**
 * @memberOf		module:models/Reports
 */

const Reports = new Model( {
    schema: ReportSchema,
    collection: "Reports",
    mixins: [
        [ Owners ],
        [ DocMessages, {
            helpers: {
                getInboxName() {
                    return "document #" + this.documentNumber + ' "' + this.getName() + '"';
                },
                getWatchers() {
                    let team = this.getTeam(),
                        members = [];
                    if ( team ) {
                        members = team.getMembers( {
                            role: "portfolio manager"
                        } )
                    }
                    return members;
                }
            }
        } ],
        [ Members ]
    ]
} )

if ( Meteor.isServer ) {
    Meteor.publish( 'Reports', () => {
        return Reports.find();
    } );
}

Reports.collection.allow( {
    remove: () => {
        return true;
    },
    update: () => {
        return true;
    }
} )

if ( Meteor.isServer ) {
    Reports.collection._ensureIndex( { 'team._id': 1 } );
    Reports.collection._ensureIndex( { 'facility._id': 1 } );
}

Reports.actions( {
    getTeam: {
        authentication: true,
        helper: ( doc ) => {

            import { Teams } from '/modules/models/Teams';

            if ( doc.team && doc.team._id ) {
                return Teams.findOne( doc.team._id );
            }
        }
    },
    getRequest: {
        authentication: true,
        helper: ( doc ) => {

            import { Requests } from '/modules/models/Requests';

            if ( doc.team && doc.team._id ) {
                return Requests.findOne( {"team._id" : doc.team._id} );
            }
        }
    },
    destroy: {
        authentication: true,
        helper: ( doc ) => {

            import { Files } from '/modules/models/Files';

            let attachments = doc.attachments;

            _.forEach( attachments, ( attach ) => {
                Files.remove( { _id: attach._id } );
            } );
            if ( doc ) {
                let owner = null;
                if ( doc.owner ) {
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
            Reports.remove( { _id: doc._id } );
        }
    },
    makePrivate: {
        authentication: true,
        helper: ( doc, private ) => {
            Reports.update( { _id: doc._id }, { $set: { "private": private } } )
        }
    },
} )
export default Reports;
