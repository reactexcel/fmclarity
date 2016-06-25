import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

TeamPageProfile = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var user, team;
    	user = Meteor.user();
    	if(user) {
    		team = Session.getSelectedTeam();
    	}
		return {
			team:team
		}
	},	

	render() {
		if(!this.data.team) {
			return <div/>
		}
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		        	<div className="col-lg-2"></div>
		            <div className="col-lg-8">
		            	<div className="ibox">
							<TeamCard item={this.data.team}/>
						</div>
					</div>
		        	<div className="col-lg-2"></div>
				</div>
			</div>
		)
	}
})
