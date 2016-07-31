import React from "react"

ServiceListTile = React.createClass({

	render () {
		var service,thumb,numRules=0;
		service = this.props.item;
		if(service) {
	        thumb = "img/services/"+service.name+".jpg";
	        if(service.data&&service.data.complianceRules) {
	        	numRules = service.data.complianceRules.length;
	        }
	    }

	    return (
	    	<div>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/

			//style['background'] = 'url(\''+url+'\')';
			//style['backgroundSize'] = "cover";

				}
				<div className="facility-thumbnail pull-left">
					<div style={{width:"37px",height:"37px",backgroundImage:"url('"+thumb+"')",backgroundSize:"cover"}}/>
				    {/*<img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />*/}
				 </div>
				 <div className="facility-info contact-card contact-card-2line">
					<span className="contact-card-line-1">
						{service.name}
					</span>
					<br/>
					<span className="contact-card-line-2">
						{
						numRules?
							<span>
								<span>{numRules} rules</span> <span style={{color:"red"}}><i className="fa fa-exclamation-triangle"/> 1</span>
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