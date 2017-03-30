/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import FacilitySchema from './schemas/FacilitySchema.jsx';

//import { Teams } from '/modules/models/Teams';

import { Model } from '/modules/core/ORM';
import { Thumbs } from '/modules/mixins/Thumbs';
import { Owners } from '/modules/mixins/Owners';
import { Members } from '/modules/mixins/Members';
import { Messages, DocMessages } from '/modules/models/Messages';
//import { DocAttachments } from '/modules/models/Documents';
import { Documents } from '/modules/models/Documents';
import { Users } from '/modules/models/Users';
import { TeamInviteEmailTemplate } from '/modules/models/Teams';
import { LoginService } from '/modules/core/Authentication'
import ReactDOMServer from 'react-dom/server';
import React from "react";


if ( Meteor.isServer ) {
    Meteor.publish( 'Facilities', function( q = {} ) {
        if ( q.team && q.team._id ) {
            return Facilities.find( { 'team._id': q.team._id } );
        }
        let facilitiesCursor = Facilities.find(),
            facilities = facilitiesCursor.fetch(),
            facilityIds = _.pluck( facilities, '_id' );

        console.log( facilityIds );
        return facilitiesCursor;
    } )
}

/**
 * @memberOf        module:models/Facilities
 */
const Facilities = new Model( {
    schema: FacilitySchema,
    collection: "Facilities",
    mixins: [
        [ Owners ],
        [ Thumbs, { defaultThumbUrl: 0 } ],
        //[ DocAttachments ],
        [ DocMessages, {
            authentication: AuthHelpers.managerOfRelatedTeam,
            helpers: {
                getInboxName() {
                    return this.getName() + " announcements"
                },
                getWatchers() {
                    return this.getMembers();
                }
            }
        } ],
        [ Members, {
            authentication: AuthHelpers.managerOfRelatedTeam,
        } ],
        /*
                [ Members, {
                    fieldName: "suppliers",
                    authentication: () => (true)
                } ]
        */
    ]
} )

Facilities.collection.allow( {
    update: () => {
        return true;
    }
} )

if ( Meteor.isServer ) {
    Facilities.collection._ensureIndex( { 'team._id': 1 } );
}

//console.log( Facilities );

//suggestion:
//rename method to writeFunction and helper to readFunction?
Facilities.actions( {
    getTeam: {
        authentication: true,
        helper: ( facility ) => {
            import { Teams } from '/modules/models/Teams';
            if ( facility.team && facility.team._id ) {
                return Teams.findOne( facility.team._id );
            }
        }
    },
    getAreas: {
        authentication: true,
        helper: function( facility, parent ) {
            var areas;
            if ( parent ) {
                areas = parent.children || [];
            }
            areas = facility.areas || [];
            // areas.sort( function( a, b ) {
            //  if ( a && a.name && b && b.name ) {
            //      return ( a.name > b.name ) ? 1 : -1;
            //  }
            // } )
            return areas;
        }
    },
    getRealEstateAgency: {
        authentication: true,
        helper: ( facility ) => {
            let realEstateAgency = null;
            if( facility.realEstateAgency && facility.realEstateAgency._id ) {
                import { Teams } from '/modules/models/Teams';
                return Teams.findOne( facility.realEstateAgency._id );
            }
        }
    },
    setAreas: {
        authentication: AuthHelpers.managerOfRelatedTeam,
        method: function( facility, areas ) {
            Facilities.update( facility._id, {
                $set: {
                    areas: areas
                }
            } );
        }
    },
    getServices: {
        authentication: true,
        helper: function( facility, parent ) {
            var services;
            if ( parent ) {
                services = parent.children || [];
            } else {
                services = facility.servicesRequired || [];
            }
            // services.sort( function( a, b ) {
            //  if ( a && a.name && b && b.name ) {
            //      return ( a.name > b.name ) ? 1 : -1;
            //  }
            // } )
            return services;
        }
    },
    getMessages: {
        authentication: true,
        helper: ( facility ) => {
            let user = Meteor.user(),
                requests = user.getRequests( { 'facility._id': facility._id } ),
                messages = null,
                requestIds = [];

            if ( requests ) {
                requestIds = _.pluck( requests, '_id' );
            }

            if ( facility ) {
                requestIds.push( facility._id );
            }

            if ( requestIds ) {
                messages = Messages.findAll( {
                    $and: [
                        { 'inboxId.query._id': user._id },
                        { 'target.query._id': { $in: requestIds } }
                    ],
                }, { sort: { createdAt: 1 } } );
            }
            return messages;
        }
    },

    setServicesRequired: {
        authentication: AuthHelpers.managerOfRelatedTeam,
        method: function( facility, servicesRequired ) {
            Facilities.update( facility._id, {
                $set: {
                    servicesRequired: servicesRequired
                }
            } );
        }
    },

    setServiceSupplier: {
        authentication: true,
        method: function( facility, serviceIdx, subserviceIdx, supplier ) {

            if ( serviceIdx ) {
                facility = Facilities._transform( facility );

                //create update location string
                updateLocation = ( "servicesRequired." + serviceIdx );
                if ( subserviceIdx ) {
                    updateLocation += ( ".children." + subserviceIdx );
                }
                updateLocation += ".data.supplier";

                //create update structure
                var update = {
                    $set: {}
                };
                update.$set[ updateLocation ] = supplier ? {
                    _id: supplier._id,
                    name: supplier.name
                } : null;

                Facilities.update( facility._id, update );
                //facility.addSupplier( supplier );
            }
        }
    },

    setupCompliance: {
        authentication: true,
        method: function( facility, rules ) {

            let services = clearComplianceRules( facility );

            for ( key in rules ) {
                let rule = rules[ key ];
                let service = null;
                let serviceIndex = null;
                for ( var i in services ) {
                    if ( services[ i ].name == key ) {
                        service = services[ i ];
                        serviceIndex = i;
                        break;
                    }
                }

                //console.log( { key, service, serviceIndex } );
                if ( service != null && serviceIndex != null ) {

                    rule.map( ( r, idx ) => {
                        r.facility = {
                            _id: facility._id
                        };
                        //console.log( r );
                        if ( !r.subservice ) {
                            if ( services[ serviceIndex ].data ) {

                                if ( services[ serviceIndex ].data.complianceRules ) {
                                    services[ serviceIndex ].data.complianceRules.push( r );
                                } else {
                                    services[ serviceIndex ].data.complianceRules = [ r ];
                                }
                            } else {
                                services[ serviceIndex ].data = {};
                                services[ serviceIndex ].data.complianceRules = [ r ];
                            }
                        } else if ( r.subservice ) {
                            let cfound = false;
                            if ( !services[ serviceIndex ].children ) {
                                services[ serviceIndex ].children = [];
                            }
                            for ( var i in services[ serviceIndex ].children ) {
                                if ( services[ serviceIndex ].children[ i ].name == r.subservice.name ) {
                                    cfound = true;
                                    if ( services[ serviceIndex ].children[ i ].data ) {
                                        if ( services[ serviceIndex ].children[ i ].data.complianceRules != null ) {
                                            services[ serviceIndex ].children[ i ].data.complianceRules.push( r );
                                        } else {
                                            services[ serviceIndex ].children[ i ].data.complianceRules = [ r ];
                                        }
                                    } else {
                                        services[ serviceIndex ].children[ i ].data = {};
                                        services[ serviceIndex ].children[ i ].data.complianceRules = [ r ];
                                    }
                                    break;
                                }
                            }
                            if ( !cfound ) {
                                services[ serviceIndex ].children.push( {
                                    name: r.subservice.name,
                                    data: {
                                        complianceRules: [
                                            r
                                        ]
                                    }
                                } );
                            }

                        }
                    } )
                } else {
                    let len = services.length
                    if ( services[ len ] == null && key ) {
                        services.push( {
                            name: key,
                            data: {
                                complianceRules: []
                            },
                            children: []
                        } );
                    }
                    rule.map( ( r, idx ) => {
                        r.facility = {
                            _id: facility._id
                        };
                        if ( !r.subservice ) {
                            if ( services[ len ].data ) {
                                if ( services[ len ].data.complianceRules ) {
                                    services[ len ].data.complianceRules.push( r );
                                } else {
                                    services[ len ].data.complianceRules = [ r ];
                                }
                            } else {
                                services[ len ].data = {};
                                services[ len ].data.complianceRules = [ r ];
                            }
                        } else if ( r.subservice ) {
                            let cfound = false;
                            if ( services[ len ].children ) {
                                for ( var i in services[ len ].children ) {
                                    if ( services[ len ].children[ i ].name == r.subservice.name ) {
                                        cfound = true;
                                        if ( services[ len ].children[ i ].data ) {
                                            if ( services[ len ].children[ i ].data.complianceRules != null ) {
                                                services[ len ].children[ i ].data.complianceRules.push( r );
                                            } else {
                                                services[ len ].children[ i ].data.complianceRules = [ r ];
                                            }
                                        } else {
                                            services[ len ].children[ i ].data = {};
                                            services[ len ].children[ i ].data.complianceRules = [ r ];
                                        }
                                        break;
                                    }
                                }
                                if ( !cfound ) {
                                    services[ len ].children.push( {
                                        name: r.subservice.name,
                                        data: {
                                            complianceRules: [
                                                r
                                            ]
                                        }
                                    } );
                                }
                            }
                        }
                    } );

                }
            }
            Meteor.call( 'Facilities.save', facility, {
                servicesRequired: services
            } );
        }
    },

    getAddress: {
        authentication: true,
        helper: function( facility ) {
            var str = '';
            var a = facility.address;
            if ( a ) {
                str =
                    ( a.streetNumber ? a.streetNumber : '' ) +
                    ( a.streetName ? ( ' ' + a.streetName ) : '' ) +
                    ( a.city ? ( ', ' + a.city ) : '' );
            }
            str = str.trim();
            return str.length ? str : null;
        }
    },

    //this is not allowing for suppliers who have a request with this facility
    getRequests: {
        authentication: true,
        helper: function( facility ) {
            var team = Session.getSelectedTeam();
            if ( team ) {
                return team.getRequests( {
                    "facility._id": facility._id
                } );
            }
        }
    },
    getIssueCount: {
        authentication: true,
        helper: function( facility ) {
            return facility.getRequests()
                .length;
        }
    },
    getDocs: {
        authentication: true,
        helper: function( facility ) {
            let docs = Documents.find( { 'facility._id': facility._id } ).fetch();
            return _.map( docs, ( doc ) => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    type: doc.type,
                    description: doc.description,
                    private: doc.private,
                }
            } );
        }
    },
    /**
     * Returns an array of supplier documents
     */
    getSuppliers: {
        authentication: true,
        helper: function( facility ) {
            // import statement placed here to avoid circular reference between Facilities and Teams
            import { Teams } from '/modules/models/Teams';

            let ids = [],
                names = [],
                suppliers = null;
            let facilitySuppliers = _.uniq(facility.suppliers, s => s._id);
                ids = _.pluck(facilitySuppliers, "_id");
                names = _.pluck(facilitySuppliers, "name");
            if ( _.isArray( facility.servicesRequired ) ) {
                _.map( facility.servicesRequired, ( s ) => {
                        let supplier = null;
                        //add children service supplier to list
                        if ( s && s.children ) {
                            _.map( s.children, ( c ) => {
                                if ( c.data && c.data.supplier ) {
                                    if ( c.data.supplier.name ) {
                                        //check that supplier name is exists in list.
                                        _.indexOf( names, c.data.supplier.name ) == -1 ? names.push( c.data.supplier.name ) : null;

                                        //check if team with name exists
                                        let team = Teams.findOne( { "name": c.data.supplier.name } );
                                        if ( !team ) {
                                            if ( c.data.supplier._id ) {
                                                _.indexOf( ids, c.data.supplier._id ) == -1 ? ids.push( c.data.supplier._id ) : null;
                                            }
                                        }
                                    } else if ( c.data.supplier._id ) {
                                        _.indexOf( ids, c.data.supplier._id ) == -1 ? ids.push( c.data.supplier._id ) : null;
                                    }
                                }
                            } );
                        }
                        if ( s && s.data ) {
                            supplier = s.data.supplier;
                            //add parent service's supplier to list
                            if ( supplier ) {
                                if ( supplier.name ) {
                                    _.indexOf( names, supplier.name ) == -1 ? names.push( supplier.name ) : null;
                                    let team = Teams.findOne( { "name": supplier.name } );
                                    if ( !team ) {
                                        if ( supplier._id ) {
                                            _.indexOf( ids, supplier._id ) == -1 ? ids.push( supplier._id ) : null;
                                        }
                                    }
                                } else if ( supplier._id ) {
                                    _.indexOf( ids, supplier._id ) == -1 ? ids.push( supplier._id ) : null;
                                }
                            }
                        }
                    } )
                    //ids = _.pluck( facility.suppliers, '_id' );
                if ( ids ) {
                    suppliers = Teams.find( {
                            $or: [
                                { _id: { $in: ids } },
                                { name: { $in: names } }
                            ]
                        }, {
                            sort: { name: 1, _id: 1 }
                        } )
                        .fetch();
                }
            }
            //Sort suppliersin ASC order
            return suppliers
        }
    },

    addSupplier: {
        authentication: true,
        method: function( facility, supplier ) {
            //console.log("addSupplier");
            if ( supplier && supplier._id ) {
                Facilities.update( {
                    "_id": facility._id
                }, {
                    $push: {
                        suppliers: {
                            _id: supplier._id,
                            name: supplier.name
                        }
                    }
                } );
                //console.log(Facilities.findOne({"_id": facility._id}),"facility");
            }
        }
    },
    /**
     *  Add personnel to facility
     **/
    addPersonnel: {
        authentication: true,
        method: ( facility, newMember ) => {
            let user = Users.collection._transform( {} ),
                group = user.getSelectedFacility();
            user._id = newMember._id;
            role = user.getRole( facility );
            threshold = user.getThreshold( facility );
            Facilities.update( { _id: facility._id }, {
                $push: {
                    members: {
                        _id: newMember._id,
                        name: newMember.profile.name,
                        role: newMember.role || role || "staff",
                        threshold: newMember.threshold || threshold || "",
                    }
                }
            } )
        }
    },

    removeDocument: {
        authentication: true,
        helper: ( facility, docToRemove ) => {
            let documents = facility.documents;
            documents = _.filter( documents, ( d ) => d._id != docToRemove._id );
            Facilities.update( { _id: facility._id }, { $set: { "documents": documents } } );
        }
    },
    removeComplianceRule: {
        authentication: true,
        helper: ( facility, servicePosition, rulePosition, serviceName ) => {
            let servicesRequired = facility.servicesRequired;
            _.map( servicesRequired, ( svc, i ) => {
                if ( svc.name == serviceName ) servicePosition = i
            } );
            servicesRequired[ servicePosition ].data.complianceRules.splice( rulePosition, 1 );
            Facilities.update( { _id: facility._id }, { $set: { "servicesRequired": servicesRequired } } );
        }
    },
    updateComplianceRule: {
        authentication: true,
        helper: ( facility, rulePosition, updatedRule, serviceName, servicePosition, subservicePosition ) => {
            let services = facility.servicesRequired;
            if ( updatedRule.document ) {
                updatedRule.docType = updatedRule.document.type;
                if ( updatedRule.document.name ) {
                    updatedRule.docName = updatedRule.document.name;
                }
                var query = JSON.stringify( updatedRule.document.query );
                updatedRule.document.query = query;
            }
            if ( subservicePosition ) {
                services[ servicePosition ]
                    .children[ subservicePosition ].data
                    .complianceRules[ rulePosition ] = updatedRule;
            } else {
                services[ servicePosition ].data
                    .complianceRules[ rulePosition ] = updatedRule;
            }
            Facilities.update( {
                _id: facility._id
            }, {
                $set: {
                    "servicesRequired": services
                }
            } );
        }
    },

    updateRealEstateAgency: {
        authentication: true,
        method: ( facility, item ) => {
            Facilities.update( {
                "_id": facility._id
            }, {
                $set: {
                    realEstateAgency: {
                        _id: item._id,
                        name: item.name,
                        type: item.type
                    }
                }
            } );
            return Facilities.findOne( { _id: facility._id } ) || facility;
        }
    },

    sendMemberInvite: {
        authentication: true,
        method: sendMemberInvite
    },

    destroy: {
        authentication: true,
        method: ( facility ) => {
            Facilities.remove( { _id: facility._id } );
        }
    },

    invitePropertyManager: {
        authentication: true,
        method: invitePropertyManager,
    },

    addPMP: {
        authentication: AuthHelpers.managerOfRelatedTeam,
    },

    addTenant: {
        authentication: AuthHelpers.managerOfRelatedTeam,
    },

    addDocument: {
        authentication: AuthHelpers.managerOfRelatedTeam,
    },

} )


function invitePropertyManager( team, email, ext ) {
    var user, id;
    var found = false;
    ext = ext || {};
    //user = Accounts.findUserByEmail(email);
    user = Users.findOne( {
        emails: {
            $elemMatch: {
                address: email
            }
        }
    } );
    if ( user ) {
        found = true;
        Meteor.call( "Facilities.addMember", team, {
            _id: user._id
        }, {
            role: ext.role
        } );
        return {
            user: user,
            found: found
        }
    } else {
        var name = DocMessages.isValidEmail( email );
        if ( name ) {
            if ( Meteor.isServer ) {
                //Accounts.sendEnrollmentEmail(id);
                var params = {
                    name: name,
                    email: email
                };
                if ( ext.owner ) {
                    params.owner = ext.owner;
                }
                /** Added Users.createUser user is added **/
                user = Meteor.call( "Users.createUser", params, '1234' )
                Meteor.call( "Facilities.addMember", team, {
                    _id: user._id
                }, {
                    role: ext.role
                } );

                return {
                    user: user,
                    found: true
                }
            }
        } else {
            return RBAC.error( 'email-blocked', 'Blocked:', 'Sorry, that email address has been blocked.' );
        }
    }

}

function sendMemberInvite( facility, recipient, team ) {
    console.log( recipient );
    let body = ReactDOMServer.renderToStaticMarkup(
        React.createElement( TeamInviteEmailTemplate, {
            team: team,
            user: recipient,
            token: LoginService.generatePasswordResetToken( recipient )
        } )
    );
    Meteor.call( 'Messages.sendEmail', recipient, {
        subject: team.name + " has invited you to join FM Clarity",
        emailBody: body
    } )
}

function clearComplianceRules( facility ) {
    let services = facility.servicesRequired;
    if ( services ) {
        services.map( ( service, idx ) => {
            if ( !services[ idx ].data ) {
                services[ idx ].data = {}
            }
            services[ idx ].data.complianceRules = [];
            if ( service.children ) {
                service.children.map( ( subservice, idy ) => {
                    if ( !services[ idx ].children[ idy ].data ) {
                        services[ idx ].children[ idy ].data = {};
                    }
                    service.children[ idy ].data.complianceRules = [];
                } )
            }
        } );
    }
    return services;
}


export default Facilities;
