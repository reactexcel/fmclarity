/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import UserSchema from './schemas/UserSchema.jsx';

import { Model } from '/modules/core/ORM';

import { Documents } from '/modules/models/Documents';
import { Files } from '/modules/models/Files';
import { Requests } from '/modules/models/Requests';

import { Thumbs } from '/modules/mixins/Thumbs';
import { Owners } from '/modules/mixins/Owners';
import { DocMessages } from '/modules/models/Messages';

import moment from 'moment';


/**
 * Users model - unlink the other models in FMC this is not a new collection but an extension of the Meteor.users collection.
 * @memberOf        module:models/Users
 */
const Users = new Model( {
    schema: UserSchema,
    collection: Meteor.users,
    mixins: [
        Owners,
        DocMessages, [ Thumbs, { repo: Files, defaultThumb: "/img/ProfilePlaceholderSuit.png" } ]
    ]
} )

Users.collection.allow( {
    update: () => {
        return true;
    }
} )

if ( Meteor.isServer ) {
    Meteor.publish( 'Users', () => {
        return Users.find();
    } );
    Users.collection._ensureIndex( { 'profile.email': 1 }, { unique: false } );
}

/** Added method create user is added **/
Users.methods( {
    createUser: {
        authentication: true,
        method: createUser
    }
} )
Users.actions( {
    getTeam: {
        authentication: true,
        helper: function() {
            var team = Session.getSelectedTeam();
            return team;
            return Session.getSelectedTeam();
        }
    },
    getTeams: {
        authentication: true,
        helper: function( user ) {
            import { Teams } from '/modules/models/Teams';
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
            if ( Meteor.isClient && !group ) {
                // causes problems when evaluated server side
                group = user.getSelectedTeam();
            }
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
    getThreshold: {
        authentication: true,
        helper: function( user, group ) {
            if ( Meteor.isClient && !group ) {
                // causes problems when evaluated server side
                group = user.getSelectedTeam();
            }
            if ( !group || !group.members || !group.members.length ) {
                return null;
            }
            for ( var i in group.members ) {
                var currentMember = group.members[ i ];
                if ( currentMember && user && currentMember._id == user._id ) {
                    return currentMember.threshold;
                }
            }
        },
    },
    getThresholdValue: {
        authentication: true,
        helper: function( user, group ) {
            if ( Meteor.isClient && !group ) {
                // causes problems when evaluated server side
                group = user.getSelectedTeam();
            }
            if ( !group || !group.members || !group.members.length ) {
                return null;
            }
            for ( var i in group.members ) {
                var currentMember = group.members[ i ];
                if ( currentMember && user && currentMember._id == user._id ) {
                    return currentMember.issueThresholdValue;
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
    getDocs: {
        authentication: true,
        helper: function( user ) {
            let docs = Documents.find( { user: { _id: user._id, name: user.name } } ).fetch();
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
    // this needs to go into requests
    //  ie requests.findForUser( userId )
    getRequests: {
        authentication: true,
        //subscription:???

        // as this function is same as publication is there a way to DRY it?
        helper: function( user, filter, options = { expandPMP: false } ) {

            let query = [ {
                'members._id': user._id
            } ]

            if ( user.role == 'admin' ) {
                query = [ { _id: { $ne: null } } ]
            }

            //if filter passed to function then add that to the query
            if ( filter ) {
                query.push( filter );
            }

            //perform query
            var requests = Requests.find( {
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

                var PMPRequests = Requests.find( {
                        $and: query
                    } )
                    .fetch();
                let time = {
                  days: {
                    endDate:"",
                    number: 1,
                    period:"days",
                    repeats : 30,
                    unit : "days"
                  },
                  weeks: {
                    endDate:"",
                    number: 1,
                    period:"weeks",
                    repeats : 10,
                    unit : "weeks"
                  },
                  fortnights: {
                    endDate:"",
                    number: 2,
                    period:"weeks",
                    repeats : 10,
                    unit : "fortnights"
                  },
                  months: {
                    endDate:"",
                    number: 1,
                    period:"months",
                    repeats : 10,
                    unit : "months"
                  },
                  monthly: {
                    endDate:"",
                    number: 1,
                    period:"months",
                    repeats : 10,
                    unit : "months"
                  },
                  quarters: {
                    endDate:"",
                    number: 3,
                    period:"months",
                    repeats : 10,
                    unit : "quarters"
                  },
                  years: {
                    endDate:"",
                    number: 1,
                    period:"years",
                    repeats : 10,
                    unit : "years"
                  },
                }
                PMPRequests.map( ( r ) => {
                  // console.log(r);
                    if ( r.hasOwnProperty('frequency') && r.frequency.hasOwnProperty("repeats") ) {
                      if(r.frequency.unit === "custom"){
                        let temp = r.frequency ;
                        r.frequency = time[r.frequency.period];
                        r.frequency.number = temp.number;
                        r.frequency.endDate = temp.endDate;
                        var date = moment( r.dueDate );
                        var repeats = parseInt( r.frequency.repeats );
                        var period = {};
                        period[ r.frequency.unit ] = parseInt( r.frequency.number );
                        // console.log(period);
                        if(r.frequency.endDate != ""){
                          for ( var i = 0; i < repeats; i++ ) {
                            var copy = Object.assign( {}, r ); //_.omit(r,'_id');
                            copy.dueDate = date.add(1 * r.frequency.number , r.frequency.period).toDate();
                             const diff_in_dates_in_days = moment(copy.dueDate).diff(moment(r.frequency.endDate), 'days');
                            // console.log(diff_in_dates_in_days);
                            if(diff_in_dates_in_days > 0){
                              return
                            }else{
                              copy = Requests.collection._transform( copy );
                              requests.push( copy );
                            }
                          }
                        }else{
                          for ( var i = 0; i < repeats; i++ ) {
                            var copy = Object.assign( {}, r ); //_.omit(r,'_id');
                            copy.dueDate = date.add(1* r.frequency.number , r.frequency.period).toDate();
                            copy = Requests.collection._transform( copy );
                            requests.push( copy );
                          }
                        }
                      }else{
                        // console.log(r);
                        r.frequency = time[r.frequency.unit];
                        var date = moment( r.dueDate );
                        var repeats = parseInt( r.frequency.repeats );
                        var period = {};
                        period[ r.frequency.unit ] = parseInt( r.frequency.number );
                        // console.log(period);
                        if(r.frequency.endDate != ""){
                          for ( var i = 0; i < repeats; i++ ) {
                            var copy = Object.assign( {}, r ); //_.omit(r,'_id');
                            copy.dueDate = date.add(1 * r.frequency.number , r.frequency.period).toDate();
                             const diff_in_dates_in_days = moment(copy.dueDate).diff(moment(r.frequency.endDate), 'days');
                            // console.log(diff_in_dates_in_days);
                            if(diff_in_dates_in_days > 0){
                              return
                            }else{
                              copy = Requests.collection._transform( copy );
                              requests.push( copy );
                            }
                          }
                        }else{
                          for ( var i = 0; i < repeats; i++ ) {
                            var copy = Object.assign( {}, r ); //_.omit(r,'_id');
                            copy.dueDate = date.add(1* r.frequency.number , r.frequency.period).toDate();
                            copy = Requests.collection._transform( copy );
                            requests.push( copy );
                          }
                        }
                      }
                    }
                } )
            }

            return requests;
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
        var user = Users.findOne( { '_id': id } );
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
    'User.checkExists': function( query ) {
        return Users.find( query ).count();
    },
    'User.getRole': () => {
        return Meteor.user().getRole();
    },
    'User.getThreshold': () => {
        return Meteor.user().getThreshold();
    },
    'User.getThresholdValue': () => {
        return Meteor.user().getThresholdValue();
    },
} )

Users.helpers( {

    collectionName: 'users',
    createUser: function( item, password ) {
        return createUser( item, password )
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
        //console.log( team );
        if ( team ) {
            Session.set( 'selectedTeam', {
                _id: team._id,
                type: team.type
            } );
        }
        Session.set( 'selectedFacility', 0 );
    },
    getSelectedTeam: function() {
        var selectedTeamQuery = Session.get( 'selectedTeam' );
        import { Teams } from '/modules/models/Teams';
        return Teams.findOne( selectedTeamQuery );
    },
    selectFacility: function( facility ) {
        Session.set( 'selectedFacility', {
            _id: facility._id
        } );
    },
    getSelectedFacility: function() {
        import { Facilities } from '/modules/models/Facilities';
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
            import { Teams } from '/modules/models/Teams';
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
            import { Facilities } from '/modules/models/Facilities';
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
            import { Teams } from '/modules/models/Teams';
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
//*/
export default Users;
