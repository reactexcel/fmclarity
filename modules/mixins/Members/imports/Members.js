/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

// Have had to remove this because of dysfunctional implementation of es6 circular dependencies
//import { Users } from '/modules/models/Users';

/**
 * @module 			module:mixins/Members
 */
const Members = {
    register,
    getMembers
}

function register( collection, opts ) {
    opts = opts || {};
    let fieldName = opts.fieldName || 'members',
        authentication = opts.authentication || AuthHelpers.managerOrOwner,
        membersCollection = opts.membersCollection || Meteor.users,
        auth = null;

    if ( _.isFunction( authentication ) ) {
        auth = {
            add: authentication,
            remove: authentication,
            setRole: authentication
        }
    } else {
        auth = {
            add: authentication.add || function() {
                return false;
            },
            remove: authentication.remove || function() {
                return false;
            },
            setRole: authentication.setRole || function() {
                return false;
            }
        }
    }

    /*
	collection.schema[ fieldName ].relation = {
		join: ( item ) => {
			if ( item != null && _.isArray( item[ fieldName ] ) ) {
				let members = [];
				item[ fieldName ].map( ( member ) => {
					let foundMember = membersCollection.findOne( member._id );
					if ( foundMember ) {
						foundMember.role = member.role;
						members.push( foundMember );
					}
				} )
				return members;
			}
		},
		unjoin: ( item ) => {
			let members = [],
				values = item[ fieldName ];

			if ( values ) {
				values.map( ( member ) => {
					members.push( {
						_id: member._id,
						name: member.profile ? member.profile.name : member.name,
						role: member.role,
					} )
				} )
			}
			return members;
		}
	}
		*/

    var fn = ucfirst( fieldName );

    var methods = {};
    var helpers = {};

    methods[ 'add' + fn ] = {
        authentication: auth.add,
        method: addMember( collection, fieldName )
    }

    methods[ 'replace' + fn ] = {
        authentication: auth.remove,
        method: replaceMembers( collection, fieldName )
    }

    methods[ 'remove' + fn ] = {
        authentication: auth.remove,
        method: removeMember( collection, fieldName )
    }

    methods[ 'set' + fn + 'Role' ] = {
        //cannot change own role
        authentication: auth.setRole,
        /*managerOrOwnerNotSelffunction(role,user,team,args){
        		    var victim = args[1];
        		    return auth.setRole(role,user,team,args)&&user._id!=victim._id;
        		},*/
        method: setMemberRole( collection, fieldName )
    }

    methods[ 'dangerouslyReplace' + fn + 's' ] = {
        authentication: true,
        method: replaceMembers( collection, fieldName )
    }

    collection[ 'get' + fn + 's' ] = getMembersGenerator( membersCollection, fieldName );


    methods[ 'get' + fn + 's' ] = {
        authentication: true,
        helper: getMembersGenerator( membersCollection, fieldName )
    }

    helpers[ 'get' + fn + 'Role' ] = getMemberRole( membersCollection, fieldName );
    helpers[ 'get' + fn + 'Relation' ] = getMemberRelation( membersCollection, fieldName );
    helpers[ 'has' + fn ] = hasMember( membersCollection, fieldName );
    helpers[ 'dangerouslyAddMember' ] = addMember( collection, fieldName );

    collection.methods( methods );
    collection.helpers( helpers );
}

function replaceMembers( collection, fieldName ) {
    return function( group, members, options = {} ) {
        //remove members with given role
        let role = options.role;

        if ( !role ) {
            return;
        }

        collection.update( group._id, {
            $pull: {
                [ fieldName ]: { role: role }
            }
        } );

        //members should be array
        if ( !_.isArray( members ) && !_.isObject( members ) ) {
            members = [ members ];
        }

        // note - this will not always be the memberId
        //  in older implementations it may be an array index
        //  a future refactor will make members a map instead
        for ( memberId in members ) {
            let member = members[ memberId ];
            collection.update( group._id, {
                $push: {
                    [ fieldName ]: {
                        _id: member._id,
                        role: role,
                        name: member.profile ? member.profile.name : member.name
                    }
                }
            } );
        }
    }
}

function addMember( collection, fieldName ) {
    return function( item, members, options ) {
        options = options || {};
        if ( !_.isArray( members ) ) {
            members = [ members ];
        }
        var role = options.role ? options.role : "staff";

        if ( !_.isArray( item[ fieldName ] ) ) {
            collection.collection.update( item._id, {
                $set: {
                    [ fieldName ]: []
                }
            } )
        }

        members.map( function( member ) {
            /** Added update is changed to save**/
            collection.collection.update( item._id, {
                $push: {
                    [ fieldName ]: {
                        _id: member._id,
                        role: role,
                        name: member.profile ? member.profile.name : member.name
                            //profile:obj.getProfile?obj.getProfile():obj
                    }
                }
            } );
        } )
    }
}

function hasMember( collection, fieldName ) {
    return function( item ) {
        var members = this[ fieldName ];
        if ( item && members && members.length ) {
            for ( var i in members ) {
                var member = members[ i ];
                if ( item._id == member._id ) {
                    return true;
                }
            }
        }
        return false;
    }
}

function removeMember( collection, fieldName ) {
    return function( item, obj ) {
        var newObject = {};
        newObject[ fieldName ] = obj._id ? {
            _id: obj._id
        } : obj;
        collection.update( item._id, {
            $pull: newObject
        } );
    }
}

function setMemberRole( collection, fieldName ) {
    return function( team, user, role ) {
        var query = {},
            action = {};
        query[ '_id' ] = team._id;
        query[ fieldName + '._id' ] = user._id;

        action[ '$set' ] = {};
        action[ '$set' ][ fieldName + '.$.role' ] = role;

        collection.update( query, action );
    }
}

function getMembers( item, { collection = Meteor.users, fieldName = "members", filter } ) {
    let ids = [],
        names = [],
        members = item[ fieldName ];

    if ( members ) {
        members.map( ( m ) => {
            if ( 
                !filter || 
                !m.role || 
                filter.role == m.role || 
                ( filter.role.$in && _.contains( filter.role.$in, m.role ) ) || 
                ( filter.role.$ne && filter.role.$ne != m.role )
            ) {
                if ( !m ) {
                    console.log( { 'Found an empty member in the array': members } );
                } else if ( m._id ) {
                    ids.push( m._id );
                } else if ( m.name ) {
                    names.push( m.name );
                }
            }
        } )
    }

    //console.log( {fieldName, name:collection._name, ids} );

    return collection.find( {
            $or: [
                { _id: { $in: ids } },
                { name: { $in: names } }
            ]
        }, {
            sort: { name: 1, _id: 1 }
        } )
        .fetch();
}

function getMembersGenerator( collection, fieldName ) {
    return function( item, filter ) {
        let ids = [],
            names = [],
            members = item[ fieldName ];

        if ( members ) {
            members.map( ( m ) => {
                if ( !filter || !m.role || filter.role == m.role || ( filter.role.$in && _.contains( filter.role.$in, m.role ) ) ) {
                    if ( !m ) {
                        console.log( { 'Found an empty member in the array': members } );
                    } else if ( m._id ) {
                        ids.push( m._id );
                    } else if ( m.name ) {
                        names.push( m.name );
                    }
                }
            } )
        }

        //console.log( {fieldName, name:collection._name, ids} );

        return collection.find( {
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

function getMemberRelation( collection, fieldName ) {
    return function( member ) {
        var group = this;
        //console.log([group,group[fieldName]]);
        for ( var i in group[ fieldName ] ) {
            var relation = group[ fieldName ][ i ];
            if ( relation && member && relation._id == member._id ) {
                return relation;
            }
        }
    }
}

function getMemberRole( collection, fieldName ) {
    return function( member ) {
        var group = this;
        var relation = group.getMemberRelation( member );
        if ( relation ) {
            return relation.role;
        }
    }
}

//console.log( Members );
export default Members;
