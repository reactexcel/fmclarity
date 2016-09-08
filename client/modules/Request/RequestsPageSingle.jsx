import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

IssuePage = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        var id = this.props.selected;
        Meteor.subscribe( 'contractors' );
        Meteor.subscribe( 'services' );
        Meteor.subscribe( 'facilities' );
        Meteor.subscribe( 'teamsAndFacilitiesForUser' );
        Meteor.subscribe( 'users' );
        Meteor.subscribe( 'allTeams' );
        var request, facility, dueDate, address;
        request = Issues.findOne( id );
        if ( request ) {
            facility = request.getFacility();
            dueDate = moment( request.dueDate ).format( 'MMMM Do YYYY, h:mm:ss a' );
            if ( facility ) {
                address = facility.getAddress();
            }
        }
        return {
            request: request,
            dueDate: dueDate,
            facility: facility,
            address: address,
            user: Meteor.user()
        }
    },

    //how would it be if every component added to this tour structure
    //and there was a significant delay before the tour is triggered to allow for all elements to load
    tour: {
        id: "single-page-request",
        steps: [ {
            title: "Welcome to FM Clarity!",
            content: "FM Clarity is a new solution designed to streamline facility management and servicing. You are currently viewing a work request that has been issued to you. At the top or the work request you will note the issuing organisation, the location of the job, and the due date",
            target: "fm-logo",
            arrowOffset: "center",
            onShow: function() {
                $( '.hopscotch-bubble-arrow-container' ).css( 'visibility', 'hidden' );
            },
            placement: "bottom"
        }, {
            title: "Work request details",
            content: "On each request you will note the general work order details, which are read-only",
            target: "summary-region",
            placement: "bottom"
        }, {
            title: "Assignee",
            content: "If you want to assign the job to a member of your team, make a selection using the assignee drop-down which will appear here. Additional team members can be added in account settings (gear icon at top right) for future work orders",
            target: "assignee-dropdown",
            placement: "top"
        }, {
            title: "Action buttons",
            content: "The action buttons display the request workflow options available to you at this time. When a job is complete, click the 'Close' button here to log the job as finished",
            target: "action-buttons",
            placement: "left"
        }, {
            title: "Collaboration region",
            content: "This is the collaboration region where stakeholders share dynamic information about the status of a job. The first tab is the discussion area where issuers, suppliers and assignees can discuss information relating to the job. Feel free to add any comments",
            target: "discussion-tab",
            onNext: function() {
                $( "#discussion-tab" ).click();
            },
            placement: "top"
        }, {
            title: "Request dropbox",
            content: "Documents relevant to each request can be uploaded from your device into the request drop-box such as quotes, images and invoices",
            target: "documents-tab",
            onShow: function() {
                $( "#documents-tab" ).click();
            },
            placement: "top"
        }, {
            title: "Request contacts",
            content: "Every job has a dedicated contact list that changes dynamically as stakeholders are added or changed. Users with the relevant permissions can add external contacts if required",
            target: "contacts-tab",
            onShow: function() {
                $( "#contacts-tab" ).click();
            },
            placement: "top"
        }, {
            title: "Settings button",
            content: 'Settings for yourself and your team can be managed by pushing this button.<br/><br/> Click on your personal information here to go to your profile settings.<br/><br/> Click on the "account settings" button to go to your team settings and upload company documents such as insurance.',
            target: "settings-icon",
            nextOnTargetClick: true,
            placement: "left"
        } ]
    },

    startTour( tour ) {
        var user = this.data.user;
        if ( !this.tourStarted && user ) {
            this.tourStarted = true;
            setTimeout( function() {
                user.startTour( tour );
            }, 1000 );
        }
    },

    componentDidUpdate() {
        this.startTour( this.tour );
    },

    componentDidMount() {
        this.startTour( this.tour );
    },

    componentWillUnmount() {
        hopscotch.endTour();
    },

    render() {
        if ( !this.data.request ) {
            return <div/>
        }
        return (
            <div id="single-issue-page" className="issue-page animated fadeIn">
                <div className="ibox">
                    <IssueDetail item = { request } />
                </div>
            </div>
        )
    }
} )
