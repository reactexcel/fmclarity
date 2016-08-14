import React from "react"

import '../Compliance/ComplianceEvaluationService.jsx';

ServiceListTile = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var service,thumb,numRules=0,numPassed=0,numFailed=0,percPassed=0;
		service = this.props.item;
		if(service) {
	        thumb = "img/services/"+service.name+".jpg";
	        if(service.data&&service.data.complianceRules) {
	        	numRules = service.data.complianceRules.length;
	        	results = ComplianceEvaluationService.evaluate(service.data.complianceRules);
	        	if(results) {
		        	numPassed = results.passed.length;
		        	numFailed = results.failed.length;
		        	percPassed = Math.ceil((numPassed/numRules)*100);
		        }
	        }
	    }
	    return {service,thumb,numRules,numPassed,numFailed,percPassed}
	},

	render () {
		var data = this.data;
	    return (
	    	<div className="service-list-tile">
				<div className="facility-thumbnail">
					<div style={{width:"37px",height:"37px",backgroundImage:"url('"+data.thumb+"')",backgroundSize:"cover"}}/>
				 </div>
				 <div className="facility-info contact-card contact-card-2line">
					<span className="contact-card-line-1">
						<span>{data.service.name}</span>
					</span>
					<br/>
					<span className="contact-card-line-2">
						{
						data.numRules?
							<span>
								<span>{data.numRules} rules </span>
								<span style={{color:data.numFailed?"red":"green"}}>{data.percPassed}% <i className="fa fa-check-circle"/> </span>
								{data.numFailed?<span style={{color:"red"}}>{data.numFailed} <i className="fa fa-exclamation-triangle"/> </span>:null}
							</span>
						:
							null
						}
            		</span>
			    </div>
			</div>
		)
	}
})