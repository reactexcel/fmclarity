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
	Meteor.publish( 'Facilities', function( q = {} ) {
		if ( q.team && q.team._id ) {
			return Facilities.find( { 'team._id': q.team._id } );
		}
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
		[ Members ],
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

if( Meteor.isServer ) {
	Facilities.collection._ensureIndex( { 'team._id': 1 } );
}

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
			areas = facility.areas || [];
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
			return Documents.find( { 'facility._id': facility._id } ).fetch();
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

			if ( _.isArray( facility.servicesRequired ) ) {
				_.map( facility.servicesRequired, ( s ) => {
						let supplier = null;
						//add children service supplier to list
						if ( s.children ) {
							_.map( s.children, ( c ) => {
								if ( c.data && typeof c.data.supplier != 'undefined' ) {
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
						if ( s.data ) {
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
			//Sort suppliersin ASC order
			return suppliers
		}
	},

	addSupplier: {
		authentication: true,
		method: function( facility, supplier ) {
			if ( supplier && supplier._id ) {
				Facilities.update( facility._id, { suppliers: { $push: _.pick( supplier, '_id', 'name' ) } } );
			}
		}
	},
	/**
	 *	Add personnel to facility
	 **/
	addPersonnel: {
		authentication: true,
		method: ( facility, newMember ) => {
			Facilities.update( { _id: facility._id }, {
				$push: {
					members: {
						_id: newMember._id,
						name: newMember.profile.name,
						role: newMember.role || "staff",
					}
				}
			} )
		}
	},
	destroy: {
		authentication: true,
		method: ( facility ) => {
			Facilities.remove( { _id: facility._id } );
		}
	},
} )

export default Facilities;
