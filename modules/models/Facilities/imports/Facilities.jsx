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
import { DocMessages } from '/modules/models/Messages';
//import { DocAttachments } from '/modules/models/Documents';
import { Documents } from '/modules/models/Documents';

if ( Meteor.isServer ) {
	Meteor.publish( 'Facilities', () => {
		return Facilities.find();
	} )
}

/**
 * @memberOf 		module:models/Facilities
 */
const Facilities = new Model( {
	schema: FacilitySchema,
	collection: "Facilities",
	mixins: [
		[ Owners ],
		[ Thumbs, { defaultThumbUrl: 0 } ],
		//[ DocAttachments ],
		[ DocMessages, {
			helpers: {
				getInboxName() {
					return this.getName() + " announcements"
				},
				getWatchers() {
					var members = this.getMembers();
					var watchers = [];
					if ( members && members.length ) {
						members.map( ( m ) => {
							watchers.push( m );
						} )
					}
					return watchers;
				}
			}
		} ],
		[ Members, {
			fieldName: "members"
		} ],

		[ Members, {
			fieldName: "suppliers",
			authentication: () => (true)
		} ]

	]
} )

//console.log( Facilities );

//suggestion:
//rename method to writeFunction and helper to readFunction?
Facilities.actions( {
	getAreas: {
		authentication: true,
		helper: function( facility, parent ) {
			var areas;
			if ( parent ) {
				areas = parent.children || [];
			}
			areas = facility.areas;
			areas.sort( function( a, b ) {
				if ( a && a.name && b && b.name ) {
					return ( a.name > b.name ) ? 1 : -1;
				}
			} )
			return areas;
		}
	},
	setAreas: {
		authentication: true,
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
			services.sort( function( a, b ) {
				if ( a && a.name && b && b.name ) {
					return ( a.name > b.name ) ? 1 : -1;
				}
			} )
			return services;
		}
	},
	setServicesRequired: {
		authentication: true,
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
			console.log( supplier );
			console.log( facility );

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
				facility.addSupplier( supplier );
			}
		}
	},

	setupCompliance: {
		authentication: true,
		method: function( facility, rules ) {
			let services = facility.servicesRequired;
			services.map( ( {
					name
				}, idx ) => {
					if ( rules[ name ] ) {
						services[ idx ].data = services[ idx ].data || {};
						services[ idx ].data.complianceRules = [];
						rules[ name ].map( ( rule ) => {
							rule.facility = {
								_id: facility._id
							};
							rule.service = {
								name
							};
							services[ idx ].data.complianceRules.push( rule );
						} )
					}
				} )
				//console.log(services);
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
					( a.streetType ? ( ' ' + a.streetType ) : '' ) +
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
			let docs = Documents.find({ facility: { _id: facility._id, name: facility.name } }).fetch();
			return _.map(docs, (doc) => {
				return {
					_id: doc._id,
					name: doc.name,
					type: doc.type,
					description: doc.description,
				}
			});
		}
	},
	getSuppliers: {
		authentication: true,
		helper: function( facility, _id ) {
			return Facilities.collection.find( _id ).fetch()[0].suppliers;
		}
	},
} )

export default Facilities;
