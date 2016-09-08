// move to own package fmc:users
import './Files.jsx';
import '../schemas/UserSchema.jsx';

import { DocOwners } from 'meteor/fmc:doc-owners';

Users = new Model( {
    schema: UserSchema,
    collection: Meteor.users,
    mixins: [
        DocOwners, 
        DocMessages,
        [ DocThumb, { repo: Files, defaultThumb: "/img/ProfilePlaceholderSuit.png" } ]
    ]
} )

Users.actions( {
    getTeam: {
        authentication: true,
        helper: function() {
            var team = Session.getSelectedTeam();
            //console.log(team);
            return team;
            return Session.getSelectedTeam();
        }
    },
    getTeams: {
        authentication: true,
        helper: function( user ) {
            return Teams.find( {
                    $or: [ {
                        "members._id": user._id
                    }, {
                        "owner._id": user._id
                    } ]
                } )
                .fetch()
        }
    },
    getRole: {
        authentication: true,
        helper: function( user, group ) {
            group = group || user.getSelectedTeam();
            if ( !group || !group.members || !group.members.length ) {
                return null;
            }
            for ( var i in group.members ) {
                var currentMember = group.members[ i ];
                if ( currentMember && user && currentMember._id == user._id ) {
                    return currentMember.role;
                }
            }
        },
    },
    //this to by updated to save/retrieve from database
    //thereby making persistent
    getSelectedTeam: {
        authentication: true,
        helper: function( user ) {
            return Session.getSelectedTeam()
        }
    },
    getSelectedFacility: {
        authentication: true,
        helper: function( user ) {
            return Session.getSelectedFacility()
        }
    },
    getRequests: {
        authentication: true,
        //subscription:???
        helper: function( user, filter, options = {
            expandPMP: false
        } ) {
            var team = user.getSelectedTeam();
            var role = user.getRole();

            if ( !team ) {
                return [];
            }

            var myFacilities = Facilities.find( {
                    "members._id": user._id
                } )
                .fetch();
            var myFacilityIds = _.pluck( myFacilities, '_id' );


            //fragments to use in query
            var isNotDraft = {
                status: {
                    $in: [ Issues.STATUS_NEW, Issues.STATUS_ISSUED, "PMP", "In Progress", "Progress", "Quoting", "Quoted", Issues.STATUS_CLOSED ]
                }
            };
            var isIssued = {
                status: {
                    $in: [ Issues.STATUS_ISSUED, "In Progress", "Progress", "Quoting", "Quoted", Issues.STATUS_CLOSED ]
                }
            };
            var isOpen = {
                status: {
                    $in: [ Issues.STATUS_NEW, "PMP", "In Progress", "Progress", Issues.STATUS_ISSUED ]
                }
            };
            var isNotClosed = {
                status: {
                    $in: [ Issues.STATUS_DRAFT, Issues.STATUS_NEW, "PMP", "In Progress", "Progress", "Quoting", "Quoted", Issues.STATUS_ISSUED ]
                }
            };
            var createdByMe = {
                "owner._id": user._id
            };

            var createdByMyTeam = {
                $and: [ {
                    "team._id": team._id
                }, isNotDraft ]
            };
            var issuedToMyTeam = {
                $and: [ {
                    $or: [ {
                        "supplier._id": team._id
                    }, {
                        "supplier.name": team.name
                    } ]
                }, isIssued ]
            };
            var assignedToMe = {
                $and: [ {
                    "assignee._id": user._id
                }, isIssued ]
            };
            var inMyFacilities = {
                $and: [ {
                    "facility._id": {
                        $in: myFacilityIds
                    }
                }, isNotDraft ]
            };

            var query = [];

            //if staff or tenant restrict to issues created by or assigned to me
            if ( role == "portfolio manager" ) {
                query.push( {
                    $or: [ issuedToMyTeam, createdByMyTeam, createdByMe, assignedToMe ]
                } );
            }
            //if manager can be issued to team, created by team, created by me, or assigned to me
            else if ( role == "manager" ) {
                if ( team.type == "contractor" ) {
                    query.push( {
                        $or: [ issuedToMyTeam, createdByMe, assignedToMe ]
                    } );
                } else if ( team.type == "fm" ) {
                    query.push( {
                        $or: [ inMyFacilities, {
                            $and: [ createdByMe, isNotClosed ]
                        }, {
                            $and: [ assignedToMe, isOpen ]
                        } ]
                    } );
                }
            } else {
                query.push( {
                    $or: [ createdByMe, assignedToMe ]
                } );
            }
            //if filter passed to function then add that to the query
            if ( filter ) {
                query.push( filter );
            }

            var requests = Issues.find( {
                    $and: query
                } )
                .fetch( {
                    sort: {
                        createdAt: 1
                    }
                } );

            if ( options.expandPMP ) {
                query.push( {
                    type: "Preventative"
                } );
                var PMPRequests = Issues.find( {
                        $and: query
                    } )
                    .fetch();
                PMPRequests.map( ( r ) => {
                    if ( r.frequency ) {
                        var date = moment( r.dueDate );
                        var repeats = parseInt( r.frequency.repeats );
                        var period = {};
                        period[ r.frequency.unit ] = parseInt( r.frequency.number );
                        //console.log(period);
                        for ( var i = 0; i < repeats; i++ ) {
                            var copy = Object.assign( {}, r ); //_.omit(r,'_id');
                            copy.dueDate = date.add( period )
                                .toDate();
                            copy = Issues._transform( copy );
                            requests.push( copy );
                        }
                    }
                } )
            }

            return requests;
            //perform and return the query
            return Issues.find( {
                    $and: query
                } )
                .fetch( {
                    sort: {
                        createdAt: 1
                    }
                } );
        }
    }
} )

function createUser( item, password ) {
    if ( Meteor.isServer ) {
        var owner = item.owner || {
            _id: Meteor.user()
                ._id,
            name: Meteor.user()
                .name
        }
        var user = {
            email: item.email,
            name: item.name,
            profile: _.extend( {}, item )
        }
        if ( password ) {
            user.password = password;
        }
        var id = Accounts.createUser( user );
        var user = Users.findOne( id );
        if ( owner ) {
            Users.update( id, {
                $set: {
                    owner: owner
                }
            } );
        }
        return user;
    }
}

Meteor.methods( {
    'User.sendInvite': function( userId ) {
        if ( Meteor.isServer ) {
            Accounts.sendEnrollmentEmail( userId );
        }
    },
} )

Users.helpers( {

    collectionName: 'users',

    login: function( callback ) {
        FMCLogin.loginUser( this, callback )
    },

    sendInvite: function() {
        Meteor.call( 'User.sendInvite', this._id );
    },

    hasRole: function( role ) {
        switch ( role ) {
            case 'dev':
                var email = this.emails[ 0 ].address;
                if ( email == 'mrleokeith@gmail.com' || email == 'mr.richo&gmail.com' ) {
                    return true;
                }
                break;
        }
    },

    tourDone: function( tour ) {
        if ( !tour || !tour.id ) return false;
        return ( Users.findOne( {
            _id: this._id,
            "profile.toursCompleted.id": tour.id
        } ) ) != null;
    },

    resetTours: function() {
        Users.update( this._id, {
            $set: {
                "profile.toursCompleted": []
            }
        } );
    },

    markTourDone: function( tour ) {
        if ( !tour || !tour.id ) return;
        Users.update( this._id, {
            $push: {
                "profile.toursCompleted": {
                    id: tour.id,
                    completedDate: new Date()
                }
            }
        } );
    },

    checkTourComplete: function( tour ) {
        var currStepNum = hopscotch.getCurrStepNum();
        var finalStep = tour.steps.length - 1;
        if ( currStepNum == finalStep ) {
            console.log( 'tour complete' );
            this.markTourDone( tour );
        }
    },

    startTour: function( tour ) {
        var currTour, user;
        currTour = hopscotch.getCurrTour();
        //if there is a tour current running and it is a different one from the tour we want to start
        if ( currTour && currTour.id != tour.id ) {
            currTour = null;
            hopscotch.endTour();
        }
        if ( !currTour ) {
            user = this;
            if ( !user.tourDone( tour ) ) {
                tour.onNext = function() {
                    user.checkTourComplete( tour );
                }
                hopscotch.startTour( tour, 0 );
            }
        }
    },

    getName: function() {
        return this.profile.name || this.profile.firstName || "Guest";
    },

    getEmail: function() {
        return this.profile.email; //this.emails[0].address;
    },

    getAvailableServices: function() {
        return [];
    },


    getProfile: function() {
        if ( !this.profile._id ) {
            this.profile._id = this._id;
        }
        return this.profile;
    },
    selectTeam: function( team ) {
        if ( team ) {
            Session.set( 'selectedTeam', {
                _id: team._id
            } );
        }
        Session.set( 'selectedFacility', 0 );
    },
    getSelectedTeam: function() {
        var selectedTeamQuery = Session.get( 'selectedTeam' );
        return Teams.findOne( selectedTeamQuery );
    },
    selectFacility: function( facility ) {
        Session.set( 'selectedFacility', {
            _id: facility._id
        } );
    },
    getSelectedFacility: function() {
        return Facilities.findOne( Session.get( 'selectedFacility' ) );
    },
    isLoggedIn: function() {
        return this._id == Meteor.userId();
    },
    isLoggedOut: function() {
        return !User.isLoggedIn();
    }
} );

if ( Meteor.isClient ) {
    //I'd really like to remove all of this from here by binding it to user
    Session.setTeamRole = function( role ) {
        return Session.set( 'selectedTeamRole', role );
    }
    Session.getTeamRole = function() {
        return Session.get( 'selectedTeamRole' );
    }
    Session.getSelectedTeam = function() {
        var selectedTeamQuery = Session.get( 'selectedTeam' );
        if ( selectedTeamQuery ) {
            return Teams.findOne( selectedTeamQuery._id );
        }
    }
    Session.selectTeam = function( team ) {
        if ( team ) {
            Session.set( 'selectedTeam', {
                _id: team._id
            } );
        } else {
            Session.set( 'selectedTeam', 0 );
        }
        Session.set( 'selectedFacility', 0 );
    }
    Session.getSelectedFacility = function() {
        var selectedFacilityQuery = Session.get( 'selectedFacility' );
        if ( selectedFacilityQuery ) {
            return Facilities.findOne( selectedFacilityQuery._id );
        }
    }
    Session.selectFacility = function( f ) {
        if ( f ) {
            Session.set( 'selectedFacility', {
                _id: f._id
            } );
        } else {
            Session.set( 'selectedFacility', 0 );
        }
    }
    Session.getSelectedClient = function() {
        var selectedClientQuery = Session.get( 'selectedClient' );
        if ( selectedClientQuery ) {
            return Teams.findOne( selectedClientQuery._id );
        }
    }
    Session.selectClient = function( c ) {
        if ( f ) {
            Session.set( 'selectedClient', {
                _id: c._id
            } );
        }
    }
}
