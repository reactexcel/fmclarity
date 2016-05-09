import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PageCompliance = React.createClass({

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	render() {return(
	<div>
		<div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"60px"}}>
		    <div className="col-lg-12">
		        <h2 style={{marginTop:"16px","float":"left"}}>Active Building Compliance</h2>
		    </div>
		</div>		
	    <div className="wrapper wrapper-content animated fadeIn">
	        <div className="row">
	            <div className="col-lg-12">
	            	<Box title="ABC Chart">
						<BarChart />
	            	</Box>
					<FilterBox
						title="ABC Services Panel"
						items={Contracts}
						itemView={{
							summary:HeadingCard
						}}
					/>
				</div>
			</div>
		</div>
	</div>
	);}
})