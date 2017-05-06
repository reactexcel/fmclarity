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
        loader: false,
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
            var docCount = null,
                docs = null,
                docName = null,
                docCurser = null,
                tomorrow = moment( moment().add( 1, "days" ).format( "MM-DD-YYYY" ), "MM-DD-YYYY" ).toDate(),
                query = rule.document && rule.document.query ?
                JSON.parse( rule.document.query ) : {
                    "facility._id": facility[ "_id" ],
                    $and: [
                        { type: rule.docType },
                        { name: { $regex: rule.docName || "", $options: "i" } }
                    ]
                };

            //----- Solution for "370 Docklands Dve"
            while(_.isString(query)) {
                query = JSON.parse( query );
            }
            //------
            if ( !rule.document && rule.docSubType ) {
                query.$and.push( {
                    [ `${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type` ]: rule.docSubType
                } );
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
            if ( docs && docs.length ) {
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
                    resolve: function(r, callback ){
                        console.log('checking ---ONE ONE --debug--------')
                        let docForModal = false;
                        if( typeof doc != 'undefined' ){
                            docForModal = doc;
                        }else if( docs.length > 0 ){
                            docForModal = docs[0];
                        }
                        if( docForModal != false ){
                             Modal.show( {
                                content: <DocViewEdit
                                    item = { docForModal }
                                    onChange={ ( docForModal ) => {
                                        callback({});
                                    }}
                                />
                            })
                        }


                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                loader: true,
                resolve: function(r, callback) {
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
                    if ( rule.docSubType ) {
                        if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                        else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                        else if ( rule.docType == "Confirmation" ) newDocument.confirmationType = rule.docSubType;
                        else if ( rule.docType == "Log" ) newDocument.logType = rule.docSubType;
                        else if ( rule.docType == "Certificate" ) newDocument.certificateType = rule.docSubType;
                        else if ( rule.docType == "Register" ) newDocument.registerType = rule.docSubType;
                        else if ( rule.docType == "Registration" ) newDocument.registrationType = rule.docSubType;
                        else if ( rule.docType == "Procedure" ) newDocument.procedureType = rule.docSubType;
                    }
                    Modal.show( {
                        content: <DocViewEdit
                                    item = { newDocument }
                                    model={Facilities}
                                    onChange={ ( doc ) => {
                                        callback({});
                                    }}
                                />
                    } )
                }
            } )
        },
        "Document is current": function( rule, facility, service ) {
            //console.log( rule );
            // if( !rule || !rule.document ) {
            //     return;
            // }
            var doc = null,
                yesterday, tomorrow, today,
                query = rule.document && rule.document.query ?
                JSON.parse( rule.document.query ) : {
                    "facility._id": facility[ "_id" ],
                    $and: [
                        { type: rule.docType },
                        { name: { $regex: rule.docName || "", $options: "i" } }
                    ]
                };
            //----- Solution for "370 Docklands Dve"
            while(_.isString(query)) {
                query = JSON.parse( query );
            }
            //-----
            if ( !rule.document && rule.docSubType ) {
                query.$and.push( {
                    [ `${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type` ]: rule.docSubType
                } );
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
                        detail: ( doc.name ? ( doc.name + " " ) : "" )
                    },
                    resolve: function(r, callback ){
                        Modal.show( {
                            content: <DocViewEdit
                                item = { doc }
                                onChange={ ( doc ) => {
                                    callback({});
                                }}
                            />
                        })
                    }
                } )
            }

            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Create document"
                },
                loader: true,
                resolve: function(r, callback) {
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
                    if ( rule.docSubType ) {
                        if ( rule.docType == "Insurance" ) newDocument.insuranceType = rule.docSubType;
                        else if ( rule.docType == "Validation Report" ) newDocument.reportType = rule.docSubType;
                        else if ( rule.docType == "Confirmation" ) newDocument.confirmationType = rule.docSubType;
                        else if ( rule.docType == "Log" ) newDocument.logType = rule.docSubType;
                        else if ( rule.docType == "Certificate" ) newDocument.certificateType = rule.docSubType;
                        else if ( rule.docType == "Register" ) newDocument.registerType = rule.docSubType;
                        else if ( rule.docType == "Registration" ) newDocument.registrationType = rule.docSubType;
                        else if ( rule.docType == "Procedure" ) rnewDocument.procedureType = rule.docSubType;
                    }
                    Modal.show( {
                        content: <DocViewEdit
                            item = { newDocument }
                            model={Facilities}
                            onChange={ ( doc ) => {
                                callback({});
                            }}
                        />
                    } )
                }
            } )
        },
        "PPM schedule established": function( rule, facility, service ) {
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
                let establishedRequest = requests[ numEvents - 1 ];
                let request = Requests.findOne( establishedRequest._id );
                let nextDate = request.getNextDate();
                let previousDate = request.getPreviousDate();
                return _.extend( {}, defaultResult, {
                    passed: true,
                    message: {
                        summary: "passed",
                        detail: `${previousDate?'Last completed '+moment( previousDate ).format( 'ddd Do MMM YYYY' )+' ➡️️ ':""}Next due date is ${moment( nextDate ).format( 'ddd Do MMM YYYY' )}`
                        //detail: numEvents + " " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PMP events setup"
                    },
                    resolve: function(r, callback) {
                        //let establishedRequest = requests[ numEvents - 1 ];
                        RequestActions.view.bind( establishedRequest, callback ).run();
                    }
                } )
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                },
                loader: true,
                resolve: function(r, callback) {
                    let team = Session.getSelectedTeam();
                    console.log( 'attempting to resolve' );
                    let newRequest = Requests.create( {
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
                    } );
                    //Meteor.call( 'Issues.save', newRequest );
                    TeamActions.createRequest.bind( team, callback, newRequest ).run();
                }
            } )
        },
        "PPM event completed": function( rule, facility, service ) {
            var event, query;
            if ( rule.event ) {
                query = {
                    'facility._id': rule.facility._id,
                    name: rule.event,
                    "service.name": rule.service.name,
                    status: {$in:["PMP"]}
                }
                if (rule.subservice) query["subservice.name"] = rule.subservice.name;
                //event = Requests.findOne(rule.event._id);
                event = Requests.findOne( query );
            }
            let nextDate,previousDate
            if(event){
                nextDate = event.getNextDate(),
                previousDate = event.getPreviousDate();
            }
            if ( event ) {
                let nextRequest = Requests.findOne( _.extend( query, {
                    type: "Ad-Hoc",
                    priority: {$in:["PPM","PMP"]},
                    status: "Complete",
                    dueDate:nextDate
                })),
                previousRequest = Requests.findOne( _.extend( query, {
                    type: "Ad-Hoc",
                    priority: {$in:["PPM","PMP"]},
                    status: "Complete",
                    dueDate:previousDate
                })),
                nextDateString = null,
                frequency = event.frequency || {},
                previousDateString = null;
               if( nextDate ) {
                   nextDateString = moment( nextDate ).format('ddd Do MMM YYYY');
               }
               if( previousDate ) {
                   previousDateString = moment( previousDate ).format('ddd Do MMM YYYY');
               }
               if (nextRequest || previousRequest) {
                   return _.extend( {}, defaultResult, {
                       passed: true,
                       message: {
                           summary: "passed",
                           //detail: `${previousRequest?'Last completed '+moment( previousDate ).format( 'ddd Do MMM' )+' ➡️️ ':""}Next due date is ${moment( nextDate ).format( 'ddd Do MMM' )}`
                           detail: function(){
                               return (
                                   <div style={{width:"95%", marginTop:"-25px", marginLeft:"55px"}}>
                                       <div className = "issue-summary-col" style = {{width:"45%"}}
                                           onClick={(e) => {
                                                e.stopPropagation();
                                                if (previousRequest)
                                                    Modal.show( {
                                                        id: `viewRequest-${event._id}`,
                                                        content: <RequestPanel item = { previousRequest }/>
                                                    } );
                                           }}
                                           >
                                           {( previousDateString && previousRequest) ?
                                               <div>
                                                   <span>Last completed <b>{ previousDateString }</b> </span>
                                                   { previousRequest ?
                                                       <span className = {`label label-${previousRequest.status}`}>{ previousRequest.status } { /*previousRequest.getTimeliness()*/ }</span>
                                                   : "N/A" }
                                               </div>
                                           : <div>Last completed N/A</div> }
                                       </div>
                                       <div className = "issue-summary-col" style = {{width:"45%"}}
                                           onClick={(e) => {
                                                e.stopPropagation();
                                                if (nextRequest)
                                                    Modal.show( {
                                                        id: `viewRequest-${event._id}`,
                                                        content: <RequestPanel item = { nextRequest }/>
                                                    } );
                                           }}
                                           >
                                           { (nextDateString && nextRequest) ?
                                               <div>
                                                   <span>Next Due <b>{ nextDateString }</b> </span>
                                                   { nextRequest ?
                                                       <span className = {`label label-${nextRequest.status}`}>{ nextRequest.status } { /*nextRequest.getTimeliness()*/ }</span>
                                                   : "N/A"}
                                               </div>
                                           : <div>Next Due N/A</div> }
                                       </div>
                                   </div>
                                );
                            }
                        },
                        data: event,
                        resolve: function(r, callback) {
                            Modal.show( {
                                id: `viewRequest-${event._id}`,
                                content: <RequestPanel item = { event } callback={callback}/>
                            } );
                        }
                    } )
               }

            }

            let q = {
                "facility._id": facility._id,
                status: "PMP",
                "service.name": rule.service.name,
                name: rule.event
            };
            if (rule.subservice){
                 q["subservice.name"] = rule.subservice.name;
            }
            let request = Requests.findOne( q );
            let message = {}
            let passed = false;
            let summary = "failed"
            if(request){
                let dueDateTimeStamp = nextDate.getTime()
                let currentTimeStamp = new Date().getTime()
                if(dueDateTimeStamp>currentTimeStamp){
                    summary = "passed"
                    passed = true;
                }
                message = {
                    summary: summary,
                    //detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                    detail: 'Last completed '+moment( previousDate ).format( 'ddd Do MMM YYYY' )+' ➡️️ '+'Next due date is '+moment( nextDate ).format( 'ddd Do MMM YYYY' )
                }
            }else if(!request){
                message = {
                    summary: summary,
                    //detail: "Set up " + ( rule.service.name ? ( rule.service.name + " " ) : "" ) + "PPM"
                    detail: "Set up PPM"
                }
            }
            return _.extend( {}, defaultResult, {
                passed: passed,
                message: message,
                loader: false,
                resolve: function(r, callback) {
                    let team = Session.getSelectedTeam();
                    console.log( 'attempting to resolve' );
                    /*let q = {
                        "facility._id": facility._id,
                        status: "PMP",
                        "service.name": rule.service.name,
                        name: rule.event
                    };
                    if (rule.subservice) q["subservice.name"] = rule.subservice.name;
                    let request = Requests.findOne( q );*/
                    // If PPM event exists.
                    if ( request ) {
                        Modal.show( {
                            id: `viewRequest-${request._id}`,
                            content: <RequestPanel item = { request } callback={callback}/>
                        } );
                    } else if ( !request ) { // If no PPM event exists.
                        let newRequest = Requests.create( {
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
                            service: rule.service,
                            subservice: rule.subservice || {},
                        } );
                        TeamActions.createRequest.bind( team, callback, newRequest ).run();
                    }
                    //    Meteor.call( 'Issues.save', newRequest );
                }
            } )
        },
        "Compliance level": function( rule, facility, service ){
            let query = {
                "facility._id": rule.facility._id,
                "service.name": rule.service.name,
                "priority": "PMP",
                "status": "Complete",
            },
            count = 0;
            if ( rule.docType == "Service Report"){
                for (let i=0; i<=12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    // console.log(request, "Service Requests", rule.service.name );
                    if (request) {
                        if (request.closeDetails && request.closeDetails.serviceReport && request.closeDetails.serviceReport._id){
                            count++;
                        }
                    }

                }
                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 service reports"
                        },
                    } )
                }
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: count + " out of 12 service reports"
                    },
                } )
            }
            if ( rule.docType == "Invoice"){
                for (let i=0; i<=12; i++  ) {
                    query["closeDetails.completionDate"] = {
                        "$gte": new moment().subtract(i, "months").startOf("months").toDate(),
                        "$lte": new moment().subtract(i, "months").endOf("months").toDate()
                    }
                    let request = Requests.findOne(query);
                    // console.log(request, "Invoice", rule.service.name );
                    if (request) {
                        if (request.closeDetails && request.closeDetails.invoice && request.closeDetails.invoice._id){
                            count++;
                        }
                    }

                }
                if (count == 12) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: count + " out of 12 Invoice"
                        },
                    } )
                }
                return _.extend( {}, defaultResult, {
                    passed: false,
                    message: {
                        summary: "failed",
                        detail: count + " out of 12 Invoice"
                    },
                } )
            }
            facility = Facilities.findOne({_id: rule.facility._id});
            if (facility) {
                let suppliers = facility.getSuppliers();
                count = 0;
                _.forEach(suppliers, (supplier) =>{
                    query = {
                        $or:[
                            {"team._id": supplier._id},
                            {"facility._id": facility._id}
                        ],
                        "type": rule.docType,
                    }
                    if ( _.contains( docList2, rule.docType ) ) {
                        query["expiryDate"] = { $gte: moment().startOf("days").toDate() };
                    }
                    if( !rule.document && rule.docSubType ){
                        query[`${rule.docType.charAt(0).toLowerCase()+rule.docType.slice(1)}Type`] = rule.docSubType
                    }
                    if ( _.contains( docList1, rule.docType ) ) {
                        query['serviceType.name'] = rule.service.name ;
                    }
                    let doc = Documents.findOne( query );
                    if (doc) {
                        count++;
                    }
                })
                let per= ( ( count / suppliers.length ) * 100 );
                //console.log({per},suppliers.length);
                if ( per >= 50) {
                    return _.extend( {}, defaultResult, {
                        passed: true,
                        message: {
                            summary: "passed",
                            detail: per + "% completed"
                        },
                    } )
                } else {
                    return _.extend( {}, defaultResult, {
                        passed: false,
                        message: {
                            summary: "failed",
                            detail: per + "% completed"
                        },
                    } )
                }
            }
            return _.extend( {}, defaultResult, {
                passed: false,
                message: {
                    summary: "failed",
                    detail:   ""
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

    function evaluate( rules, facility ) {
        var results = {
            passed: 0,
            failed: 0,
            all:[]
        };
        if ( !_.isArray( rules ) ) {
            rules = [ rules ];
        }
        rules.map( ( r ) => {
            var result = evaluateRule( r, facility );
            if ( result.passed ) {
                //results.passed.push( result );
                results.passed++;
            } else {
                //results.failed.push( result );
                results.failed++;
            }
            results.all.push( result );
        } )
        //console.log({results}, "evaluate");
        return results;
    }

    function evaluateService( service, facility ) {
        if ( !service || !service.data || !service.data.complianceRules ) {
            return null;
        }
        var numRules = 0, numPassed = 0, numFailed = 0, percPassed = 0, passed = false;
        var results = evaluate( service.data.complianceRules );
        if ( service.children ) {
            var numSubservices = 0;
            var totalPassed = 0;
            var totalFailed = 0;
            var subservice = _.map(service.children, ( subservice, idx) => {
                var subResult = evaluateService( subservice, facility );
                numSubservices += subResult.numRules;
                totalPassed += subResult.numPassed;
                totalFailed += subResult.numFailed;
                return subResult;
            });
            numRules = service.data.complianceRules.length + numSubservices;
            numPassed = results.passed + totalPassed;
            numFailed = results.failed + totalFailed;
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
            passed = false;
            if ( percPassed == 100 ) {
                passed = true;
            }
            return {
                name: service.name,
                passed,
                percentPassed: percPassed,
                numPassed,
                numFailed,
                numRules,
                results,
                subservice
            }
        } else {
            numRules = service.data.complianceRules.length;
            numPassed = results.passed;
            numFailed = results.failed;
            percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
            passed = false;
            if ( percPassed == 100 ) {
                passed = true;
            }
            return {
                name: service.name,
                passed,
                percentPassed: percPassed,
                numPassed,
                numFailed,
                numRules,
                results,
            }
        }
        // return {
        //     name: service.name,
        //     passed,
        //     percentPassed: percPassed,
        //     numPassed,
        //     numFailed,
        //     results
        // }
    }

    /**
     * @function    evaluateServices
     * @param       {object} services
     *
     * Evaluates the rules embedded in the provided service object
     *
     */
    function evaluateServices( services ) {
        let rules = [],
            results = { passed: [], failed: [] },
            overall = {},
            nulRules = 0,
            numPassed = 0,
            numFailed = 0,
            numRules = 0,
            percPassed = 100,
            passed = false;
            overallServiceresults = [];
            facility = Session.getSelectedFacility();
            //console.log(facility,"facility");
        overallServiceresults = services.map( ( service, idx ) => {

            // if the service has no data don't include in calculations
            if( !service || !service.data || !service.data.complianceRules ) {
                return null;
            }
            let result = evaluateService( service, facility );

            if ( result.passed ) {
                results.passed.push( result );
            } else {
                results.failed.push( result );
            }
            //console.log(result, idx);
            //rules = rules.concat( service.data.complianceRules );
            numRules += result.numRules;
            numPassed += result.numPassed;
            numFailed += result.numFailed;
            return result;
        } )

        //overall = evaluate( rules );
        // numRules = rules.length;
        // numPassed = overall.passed.length;
        // numFailed = overall.failed.length;
        //console.log({numRules, numPassed, numFailed});
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
            servicesFailed: results.failed.length,
            overallServiceresults,
        }

    }

    return {
        evaluateRule,
        evaluate,
        evaluateServices
    }
}
