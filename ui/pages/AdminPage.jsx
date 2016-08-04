import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AdminPage = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var user,url;
		//var user = Meteor.user();
		var user = Users.findOne({'profile.name':"Leo"});
		if(user&&!this.created) {
			var token = FMCLogin.generateLoginToken(user);
			console.log(token);
			url = FMCLogin.getUrl(token,'admin');
			console.log(url);
			//FMCLogin.loginWithToken(token.token);
			this.created=true;
		}
		return {
			url:url
		}
	},


	render() {
		return (
			<div>
		        <div className="row">
		            <div className="col-md-12">
		            	<div className="ibox">
		            		{this.data.url}
						</div>
					</div>
				</div>
			</div>
		)
	}
})