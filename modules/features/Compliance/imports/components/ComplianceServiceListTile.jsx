import React from "react"

//import { ComplianceEvaluationService } from '/modules/features/Compliance';

export default ServiceListTile = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var service, thumb, numRules = 0,
			numPassed = 0,
			numFailed = 0,
			percPassed = 0;
		service = this.props.item;
		let { isService } = this.props;
		if ( service  && isService ) {
			let complianceRules = null;
			if ( service.data && service.data.complianceRules ) {
				complianceRules = service.data.complianceRules;
				if( service.children ) {
					service.children.map( ( subservice, idx ) => {
						if( subservice.data && subservice.data.complianceRules )
							complianceRules = complianceRules.concat( subservice.data.complianceRules );
					})
				}
			}
			thumb = "img/services/" + service.name + ".jpg";
			if ( complianceRules ) {
				numRules = complianceRules.length;
				results = ComplianceEvaluationService.evaluate( complianceRules );
				if ( results ) {
					numPassed = results.passed.length;
					numFailed = results.failed.length;
					percPassed = Math.ceil( ( numPassed / numRules ) * 100 );
				}
			}
		}
		return { service, thumb, numRules, numPassed, numFailed, percPassed, isService }
	},

	render() {
		var data = this.data;
		return (
			<div className="service-list-tile" onClick={this.props.onClick?this.props.onClick:null}>
				{/*
				<div className="facility-thumbnail">
					<div style={{width:"37px",height:"37px",backgroundImage:"url('"+data.thumb+"')",backgroundSize:"cover"}}/>
				 </div>
				*/}
				 <div className="facility-info contact-card contact-card-2line">
					<span className="contact-card-line-1">
						<span>{data.service.name}</span>
					</span>
					<br/>
					{data.isService?<span className="contact-card-line-2">
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
            		</span>:null}
			    </div>
			</div>
		)
	}
} )
