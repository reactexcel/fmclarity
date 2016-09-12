import FacilitySchema from './FacilitySchema.jsx';

import { Teams } from '/both/modules/Team';

import { Model } from 'meteor/fmc:orm';
import { DocThumbs } from '/both/modules/DocThumbs';
import { DocOwners } from '/both/modules/DocOwners';
import { DocMembers } from '/both/modules/DocMembers';
import { DocMessages } from '/both/modules/DocMessages';
import { DocAttachments } from '/both/modules/DocAttachments';

if ( Meteor.isServer ) {
	Meteor.publish( 'Facilities', () => {
		return Facilities.find();
	} )
}

export default Facilities = new Model( {
	schema: FacilitySchema,
	collection: "Facilities",
	mixins: [
		[ DocOwners ],
		[ DocThumbs, { defaultThumbUrl: 0 } ],
		[ DocAttachments, { authentication: AuthHelpers.managerOfRelatedTeam } ],
		[ DocMessages, {
			authentication: AuthHelpers.managerOfRelatedTeam,
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
		[ DocMembers, [ {
			authentication: AuthHelpers.managerOfRelatedTeam,
			fieldName: "members",
		}, {
			fieldName: "suppliers",
			authentication: AuthHelpers.managerOfRelatedTeam,
			membersCollection: Teams,
			/*
			// or???
			authentication:{
			  create:AuthHelpers.managerOfRelatedTeam,
			  read:AuthHelpers.managerOfRelatedTeam,
			  update:AuthHelpers.managerOfRelatedTeam,
			  delete:AuthHelpers.managerOfRelatedTeam,
			}
			*/
		} ] ]
	]
} )

//suggestion:
//rename method to writeFunction and helper to readFunction?
Facilities.actions( {
	getAreas: {
		authentication: AuthHelpers.memberOfRelatedTeam,
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
		authentication: AuthHelpers.memberOfRelatedTeam,
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
		authentication: AuthHelpers.managerOfRelatedTeam,
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
	getIssues: {
		authentication: true,
		helper: function( facility ) {
			var team = Session.getSelectedTeam();
			if ( team ) {
				return team.getIssues( {
					"facility._id": facility._id
				} );
			}
		}
	},
	getIssueCount: {
		authentication: true,
		helper: function( facility ) {
			return facility.getIssues()
				.length;
		}
	}
} )

if ( Meteor.isServer ) {
	Meteor.publish( 'facilities', function() {
		return Facilities.find();
	} );
} else {
	Meteor.subscribe( 'facilities' );
}
