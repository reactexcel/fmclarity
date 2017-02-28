import { Facilities } from '/modules/models/Facilities';
import { Requests, RequestPanel, RequestActions } from '/modules/models/Requests';
import { Documents, DocViewEdit } from '/modules/models/Documents';
import { TeamActions } from '/modules/models/Teams';
import React from 'react';
import moment from 'moment';

ComplianceEvaluationService = new function() {

    var defaultResult = {
        passed: false,
        message: {
            summary: "failed"
        },
        resolve() {
            alert( 'No resolution available' );
        }
    }


    var docList1 = [
            "Audit",
            "Contract",
            "Inspection",
            "Invoice",
            "MSDS",
            "Plan",
            "Assessment",
            "Confirmation",
            "Certificate",
            "Log",
            "Management Plan",
            "Procedure",
            "Quote",
            "Register",
            "Registration",
            "Service Report",
            "SWMS",
        ],
        docList2 = [
            'Bank Guarantee',
            'Contract',
            'Emergency Management',
            'Insurance',
            'Lease',
            'Quote',
            'Register',
            'Registration'
        ];

    var evaluators = {
        //can pass in facility and service for more efficient calculation
        "Document exists": function( rule, facility, service ) {
            //  console.log({rule});
            var docCount = null, docs = null, docName = null, docCurser = null,
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ) ).toDate(),
                query = rule.document &&rule.document.query ?
                        JSON.parse( rule.document.query ) : {
                            "facility._id": facility["_id"],
                            $and: [
                                { type: rule.docType },
                                { name: { $regex: rule.docName || "", $options: "i" } }
                            ]
                        };
            if( !rule.document && rule.docSubType ){
                query.$and.push({
                    [`${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type`]: rule.docSubType
                });
            }
            if ( _.contains( docList1, rule.docType ) ) {
                query.$and.push( { 'serviceType.name': rule.service.name } );
            }
            if ( _.contains( docList2, rule.docType ) ) {
                query && query.$and.push( { expiryDate: { $gte: tomorrow } } );
            }
            docCurser = query && Documents.find( query );
            docCount = docCurser.count();
            docs = docCurser.fetch();
            if( docs && docs.length ) {
                let doc = docs[ docCount - 1 ];
                docName = doc.name;
            }
            //   console.log({count: docCount});
            //   console.log(query);
            if ( docCount ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: docCount + " " + ( docName ? ( docName + " " ) : "" ) + "documents exists."
                    },
                    resolve: function() {
                        //Select the last document
                        let existDocuent = docs[ docCount - 1 ]
                        Modal.show( {
                            content: <DocViewEdit item = { existDocuent } model={Facilities} />
                        } )
                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                resolve: function() {
                    let type = "team",
                        team = Session.getSelectedFacility(),
                        _id = team._id,
                        name = team.name,
                        owner = Meteor.user(),
                        newDocument = Documents.create( {
                            team: { _id, name },
                            owner: { type, _id, name },
                            name: rule.docName,
                            type: rule.docType,
                            serviceType: rule.service,
                        } );
                    Modal.show( {
                        content: <DocViewEdit item = { newDocument } model={Facilities} />
                    } )
                }
            } )
        },
        "Document is current": function( rule, facility, service ) {
            //console.log( rule );
            // if( !rule || !rule.document ) {
            //     return;
            // }
            var doc = null, yesterday, tomorrow, today,
                query = rule.document && rule.document.query ?
                    JSON.parse( rule.document.query ) : {
                        "facility._id": facility["_id"],
                        $and: [
                            { type: rule.docType },
                            { name: { $regex: rule.docName || "", $options: "i" } }
                        ]
                    };
            if( !rule.document && rule.docSubType ){
                query.$and.push({
                    [`${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type`]: rule.docSubType
                });
            }
            if ( _.contains( docList1, rule.docType ) ) {
                query.$and.push( { 'serviceType.name': rule.service.name } );
            }
            if ( _.contains( docList2, rule.docType ) ) {
                //format of timestamp should be as Jan 01 2017 00:00:00 GMT (IST).
                yesterday = moment( moment().subtract( 1, "days" ).format( "MM-DD-YYYY" ) ).toDate();
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ) ).toDate();
                today = Object.assign( {}, { $gt: yesterday, $lt: tomorrow } );
                query.$and.push( { expiryDate: today } );
            }
            doc = query && Documents.findOne( query );
            //    console.log({count: docCount});
            //    console.log(query);
            if ( doc ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: ( doc.name? ( doc.name + " " ) : "" )
                    },
                    resolve: function() {
                        let currentDocument = doc;
                        Modal.show( {
                            content: <DocViewEdit item = { currentDocument } model={Facilities} />
                        } )
                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                resolve: function() {
                    let type = "team",
                        team = Session.getSelectedFacility(),
                        _id = team._id,
                        name = team.name,
                        owner = Meteor.user();

                    let newDocument = Documents.create( {
                        team: { _id, name },
                        owner: { type, _id, name },
                        name: rule.docName,
                        type: rule.docType,
                        serviceType: rule.service,
                    } );
                    Modal.show( {
                        content: <DocViewEdit item = { newDocument } model={Facilities} />
                    } )
                }
            } )
        },
        "PPM schedule established": function( rule, facility, service ) {
            //console.log(rule);
            if ( !facility ) {
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: "Facility not specified"
                    }
                } )
            } else if ( !rule.service ) {
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: "Service not specified"
                    }
                } )
            }
            var requestCurser = Requests.find( { 'facility._id': facility._id, 'service.name': rule.service.name, type: "Preventative" } );
            var numEvents = requestCurser.count();
            var requests = requestCurser.fetch();
            if ( numEvents ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: numEvents + " " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PMP events setup"
                    },
                    resolve: function() {
                        let establishedRequest = requests[ numEvents - 1 ];
                        RequestActions.view.bind(establishedRequest).run();
                    }
                } )
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                },
                resolve: function() {
                    let team = Session.getSelectedTeam();
                    console.log( 'attempting to resolve' );
                    let newRequest = Requests.create({
                        facility: {
                            _id: facility._id,
                            name: facility.name
                        },
                        team: team,
                        type: 'Preventative',
                        priority: 'Scheduled',
                        status: 'PMP',
                        name: rule.event,
                        frequency: rule.frequency,
                        service: rule.service
                    });
                    //Meteor.call( 'Issues.save', newRequest );
                    TeamActions.createRequest.bind(team, null, newRequest).run();
                }
            } )
        },
        "PPM event completed": function( rule, facility, service ) {
            var event;
            if ( rule.event ) {
                //event = Requests.findOne(rule.event._id);
                event = Requests.findOne( {
                    'facility._id': rule.facility._id,
                    name: rule.event,
                    status: "Issued",
                    type: "Ad-Hoc",
                    priority: "PMP"
                } );
            }

            if ( event ) {
                let nextDate = event.getNextDate();
                    previousDate = event.getPreviousDate();
                    nextRequest = event.findCloneAt( nextDate );
                    previousRequest = event.findCloneAt( previousDate );
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: `Last completed ${moment( previousDate ).format( 'ddd Do MMM YY' )} ➡️️ Next due date is ${moment( nextDate ).format( 'ddd Do MMM YY' )}`
                    },
                    data: event,
                    resolve: function() {
                        Modal.show( {
                            id: `viewRequest-${event._id}`,
                            content: <RequestPanel item = { event } />
                        } );
                    }
                } )
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                },
                resolve: function() {
                    let team = Session.getSelectedTeam();
                    console.log( 'attempting to resolve' );
                    let request = Requests.findOne( {
                            "facility._id": facility._id,
                            type: 'Preventative',
                            status:"PMP",
                            service: rule.service,
                            name: rule.event
                        } );
                    // If PPM event exists.
                    if( request ){
                        Modal.show( {
                            id: `viewRequest-${request._id}`,
                            content: <RequestPanel item = { request } />
                        } );
                    } else if( !request ) { // If no PPM event exists.
                        let newRequest = Requests.create({
                            facility: {
                                _id: facility._id,
                                name: facility.name
                            },
                            team: team,
                            type: 'Preventative',
                            priority: 'Scheduled',
                            status: 'PMP',
                            name: rule.event,
                            frequency: rule.frequency,
                            service: rule.service
                        });
                        TeamActions.createRequest.bind( team, null, newRequest ).run();
                    }
                //    Meteor.call( 'Issues.save', newRequest );
                }
            } )
        },
        "Compliance level": function( rule, facility, service ){

        },
    }

    function evaluateRule( rule, facility, service ) {
        if( !rule ) {
            return;
        }
        if ( !facility && rule.facility ) {
            facility = Facilities.findOne( rule.facility._id );
        }
        var func, result;
        func = evaluators[ rule.type ];
        if ( func ) {
            result = func( rule, facility, service );
        } else {
            console.log( "No " + rule.type + " evaluator" );
        }
        return result || {
            passed: false
        }
    }

    function evaluate( rules ) {
        var results = {
            passed: [],
            failed: []
        };
        if ( !_.isArray( rules ) ) {
            rules = [ rules ];
        }
        rules.map( ( r ) => {
            var result = evaluateRule( r );
            if( !result ) {
                // do nothing
            }
            else if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
        } )
        return results;
    }

    function evaluateService( service ) {
        if( !service || !service.data || !service.data.complianceRules ) {
            return;
        }
        var results = evaluate( service.data.complianceRules );
        var numRules = service.data.complianceRules.length;
        var numPassed = results.passed.length;
        var numFailed = results.failed.length;
        var percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
        var passed = false;
        if ( percPassed == 100 ) {
            passed = true;
        }
        return {
            name: service.name,
            passed,
            percentPassed: percPassed,
            numPassed,
            numFailed,
            results
        }
    }

    function evaluateServices( services ) {
        var rules = [];
        results = { passed: [], failed: [] },
            overall = {},
            nulRules = 0,
            numPassed = 0,
            numFailed = 0,
            percPassed = 100,
            passed = false;

        services.map( ( s ) => {
            let result = evaluateService( s );
            if( !result ) {
                // do nothing
            }
            else if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
            if( s.data && s.data.complianceRules ) {
                rules = rules.concat( s.data.complianceRules );
            }
        } )

        overall = evaluate( rules );
        numRules = rules.length;
        numPassed = overall.passed.length;
        numFailed = overall.failed.length;

        if ( numRules ) {
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
        }
        if ( percPassed == 100 ) {
            passed = true;
        }

        return {
            passed,
            percentRulesPassed: percPassed,
            numRulesPassed: numPassed,
            numRulesFailed: numFailed,
            servicesPassed: results.passed.length,
            servicesFailed: results.failed.length
        }


    }

    return {
        evaluateRule,
        evaluate,
        evaluateServices
    }
}
