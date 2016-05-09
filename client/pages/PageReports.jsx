import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PageReports = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
    <div className="wrapper wrapper-content animated fadeIn">
        <div className="row">
            <div className="col-lg-12">
	            <Box title="Reports">
	            	<div style={{height:"800px"}}>
	            		<img src="img/reports-screen.png"/>
	            	</div>
	            </Box>
			</div>
		</div>
	</div>
	);}
})