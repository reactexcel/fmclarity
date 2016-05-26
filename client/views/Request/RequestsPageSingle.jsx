import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

IssuePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var id = this.props.selected;
        Meteor.subscribe('contractors');
        Meteor.subscribe('services');
        Meteor.subscribe('facilities');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
        Meteor.subscribe('allTeams');
        var request, facility, dueDate, address;
        request = Issues.findOne(id);
        if(request) {
            facility = request.getFacility();
            dueDate = moment(request.dueDate).format('MMMM Do YYYY, h:mm:ss a');
            if(facility) {
                address = facility.getAddress();
            }
        }
        return {
        	request:request,
            dueDate:dueDate,
            facility:facility,
            address:address
        }
    },

    //how would it be if every component added to this tour structure
    //and there was a significant delay before the tour is triggered to allow for all elements to load
    tour:{
      id: "single-issue",
      steps: [
        {
          title: "Welcome to FM Clarity!",
          content: "Welcome to FM Clarity - a new solution to streamline facility management and servicing. You are currently on the work request screen.",
          target: "fm-logo",
          onShow:function(){
            $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
          },
          placement: "bottom"
        },{
          title: "Summary region",
          content: "At the top of each request is the summary area showing you at a glance the issuing team, the location of the job, and the due date.",
          target: "summary-region",
          placement: "bottom"
        },{
          title: "Job status region",
          content: "This is the job status region which displays the job creator, status and priority.",
          target: "status-region",
          placement: "right"
        },{
          title: "Primary request info",
          content: "In this region you will see the primary request info including title, code, cost and due date. Due dates are automatically set based on the selected job priority but can be customised here prior to issuing the job.",
          target: "primary-info-region",
          placement: "bottom"
        },{
          title: "Location region",
          content: "This region displays the location of the job including the building, level, area and sub-area.",
          target: "location-region",
          placement: "bottom"
        },{
          title: "Supplier region",
          content: "The supplier region shows the type of service and sub-service (if applicable). When filling a request jobs are automatically matched with appropriate suppliers from your contact list. If this is an internal request, or if you are a supplier and you want to assign the job to a member of your team, make a selection using the assignee drop-down here.",
          target: "supplier-region",
          placement: "top"
        },{
          title: "Action buttons",
          content: "The action buttons display the request workflow options available to you at this time. When a job is complete, click the 'Close' button here to log the job as finished.",
          target: "action-buttons",
          placement: "left"            
        },{
          title: "Collaboration region",
          content: "This is the collaboration region where stakeholders share dynamic information about the status of a job. The first tab is the comments area where issuers, suppliers and assignees can relay information.",
          target: "discussion-tab",
          onNext:function(){
            $("#documents-tab").click();
          },
          placement: "top"            
        },{
          title: "Request dropbox",
          content: "Documents relevant to each request can be uploaded into the request drop-box here.",
          target: "documents-tab",
          onNext:function(){
            $("#contacts-tab").click();
          },
          placement: "top"            
        },{
          title: "Request contacts",
          content: "Every job has a dedicated contact list that changes dynamically as stakeholders are added or changed. Users with the relevant permissions can add external contracts if required.",
          target: "contacts-tab",
          placement: "top"            
        },
        {
          title: "Enjoy!",
          content: 'Thanks for using FM Clarity. If you have any other questions please feel free to contact our support team at <a href="mailto:contact@fmclarity.com">contact@fmclarity.com</a>.',
          target: "fm-logo",
          onShow:function(){
            $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
          },
          placement: "bottom"
        }
      ]
    },

    componentDidMount(){
        //*
        var tour = this.tour;
        setTimeout(function(){
            hopscotch.startTour(tour,0);
        },1000);
        //*/
    },

    render() {
        var request = this.data.request;
        var facility = this.data.facility;
        var dueDate = this.data.dueDate;
        var address = this.data.address;
        if(!request) {
            return <div/>
        }
    	return (
            <div>
                <div id="single-issue-page" className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3 id="summary-region">{request.team.name}<br/>
                            Work Request #{request.code}<br/>
                            {address}<br/>
                            Due {dueDate}</h3>
                        </div>
                        <div className="col-xs-12">
                            <div className="ibox">
                            	<IssueDetail item={request} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})