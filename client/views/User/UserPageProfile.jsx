import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

UserProfilePage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
		return {
			user:Meteor.user()
		}
	},

	render() {
		return (
		    <div className="wrapper wrapper-content animated fadeIn">
		        <div className="row">
		            <div className="col-lg-6">
		            	<div className="ibox">
							<UserCard item={this.data.user} edit={true}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
})