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

    tour:{
      id: "single-issue",
      steps: [
        {
          title: "Welcome to FM Clarity!",
          content: "Welcome to FM Clarity - a new solution to streamline facility management and servicing. This is the work request screen.",
          target: "fm-logo",
          placement: "bottom"
        },{
          title: "Identity information",
          content: "At the top of each request is the identity area showing you the team who has issued the request, the location of the job, and the due date.",
          target: "identity-area",
          placement: "bottom"
        }
      ]
    },

    componentDidMount(){
        /*
        var tour = this.tour;
        setTimeout(function(){
            hopscotch.startTour(tour);
        },2000);
        */
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
                        <div id="identity-area" className="col-xs-12">
                            <h3>{request.team.name}<br/>
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