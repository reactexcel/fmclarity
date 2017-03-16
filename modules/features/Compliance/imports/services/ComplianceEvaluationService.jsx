import { Facilities } from '/modules/models/Facilities';
import { Requests, RequestActions } from '/modules/models/Requests';
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
            "Registration",
            "Licence",
            "Report",
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
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ), "MM-DD-YYYY" ).toDate(),
                query = rule.document &&rule.document.query ?
                        JSON.parse( rule.document.query ) : {
                            "facility._id": facility["_id"],
                            $and: [
                                { type: rule.docType },
                                // { name: { $regex: rule.docName || "", $options: "i" } }
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
                        if (rule.docSubType) {
                            if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                            else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                            else if ( rule.docType == "Confirmation") newDocument.confirmationType = rule.docSubType;
                            else if ( rule.docType == "Log") newDocument.logType = rule.docSubType;
                            else if ( rule.docType == "Certificate") newDocument.certificateType  = rule.docSubType;
                            else if ( rule.docType == "Register") newDocument.registerType  = rule.docSubType;
                            else if ( rule.docType == "Registration") newDocument.registrationType  = rule.docSubType;
                            else if ( rule.docType == "Procedure") rnewDocument.procedureType  = rule.docSubType;
                        }
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
                            // { name: { $regex: rule.docName || "", $options: "i" } }
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
                yesterday = moment( moment().subtract( 1, "days" ).format( "MM-DD-YYYY", "MM-DD-YYYY" ) ).toDate();
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ), "MM-DD-YYYY" ).toDate();
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
                    if (rule.docSubType) {
                        if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                        else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                        else if ( rule.docType == "Confirmation") newDocument.confirmationType = rule.docSubType;
                        else if ( rule.docType == "Log") newDocument.logType = rule.docSubType;
                        else if ( rule.docType == "Certificate") newDocument.certificateType  = rule.docSubType;
                        else if ( rule.docType == "Register") newDocument.registerType  = rule.docSubType;
                        else if ( rule.docType == "Registration") newDocument.registrationType  = rule.docSubType;
                        else if ( rule.docType == "Procedure") rnewDocument.procedureType  = rule.docSubType;
                    }
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
                    status: "Complete",
                    type: "Ad-Hoc",
                    priority: "PMP"
                } );
            }

            if ( event ) {
                let nextDate = event.getNextDate();
                   previousDate = event.getPreviousDate();
                   nextRequest = event.findCloneAt( nextDate );
                   previousRequest = event.findCloneAt( previousDate );
                   nextDateString = null,
                   frequency = event.frequency || {},
                   previousDateString = null;

               if( nextDate ) {
                   nextDateString = moment( nextDate ).format('ddd Do MMM');
               }
               if( previousDate ) {
                   previousDateString = moment( previousDate ).format('ddd Do MMM');
               }
               return _.extend( {}, defaultResult, {
                   passed: true,
                   message: {
                       summary: "passed",
                       //detail: `${previousRequest?'Last completed '+moment( previousDate ).format( 'ddd Do MMM' )+' ➡️️ ':""}Next due date is ${moment( nextDate ).format( 'ddd Do MMM' )}`
                       detail: function(){
                           return (
                               <span style={{position:"absolute", bottom: "13%"}}>
                                   <span className = "issue-summary-col" style = {{width:"25%"}}>
                                       due every {`${frequency.number||''} ${frequency.unit||''}`}
                                   </span>
                                   <span className = "issue-summary-col" style = {{width:"32%"}}>
                                       {!!( previousDateString && previousRequest) ?
                                           <span>
                                               <span>previous <b>{ previousDateString }</b> </span>
                                               { previousRequest ?
                                                   <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status } { previousRequest.getTimeliness() }</span>
                                               : null }
                                           </span>
                                       : null }
                                   </span>
                                   <span className = "issue-summary-col" style = {{width:"35%"}}>
                                       { nextDateString && nextRequest ?
                                           <span>
                                               <span>next due <b>{ nextDateString }</b> </span>
                                               { nextRequest ?
                                                   <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status } { nextRequest.getTimeliness() }</span>
                                               : null }
                                           </span>
                                       : null }
                                   </span>
                               </span>
                           );
                       }
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
            let createdAt = { $lte: new Date(), $gte: moment().subtract(1, "years").toDate() };
            var docCount = null, totalDocs = null, docName = null, docCurser = null,
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
            totalDocs = query && Documents.find( query ).count();
            if ( query && !query.createdAt ) {
                query.createdAt = createdAt;
            }
            docCount = query && Documents.find( query ).count();

            let perComplete = ( ( docCount / totalDocs ) * 100 )

            console.log({docCount, totalDocs, query, perComplete, name:rule.service.name });

            if ( perComplete >= 50 ) {
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: perComplete + "% " + "completed."
                    },
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail:  totalDocs?perComplete:0 + "% " + ( docName ? ( docName + " " ) : "" ) + "completed."
                },
            } )
        },
    }

    function evaluateRule( rule, facility, service ) {
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
            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
        } )
        return results;
    }

    function evaluateService( service ) {
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
            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
            rules = rules.concat( s.data.complianceRules );
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
