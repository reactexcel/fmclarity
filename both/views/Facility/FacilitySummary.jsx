FacilitySummary = React.createClass({

	getInitialState() {
		return {
			expanded:false
		}
	},

	render() {
	    var facility = this.props.item || {};
	    var contact = facility._contacts?facility._contacts[0]:null;
	    return (
	    	<div>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/}
				<div className="facility-thumbnail pull-left">
				    <img style={{width:"40px"}} alt="image" src={facility.getThumbUrl()} />
				 </div>
				 <div className="facility-info">
					<a href="#">
						{facility.getName()}
					</a>
					<br/>
					{contact?
					<span style={{fontSize:"11px",color:"#777"}}>
						<b style={{color:"#000"}}>Contact </b>
						{contact.name}&nbsp;&nbsp;
						<i className="fa fa-envelope"></i>&nbsp;&nbsp;
						{contact.email}&nbsp;&nbsp;
						<i className="fa fa-phone"></i>&nbsp;&nbsp;
						{contact.phone}
					</span>
					:null}
			    </div>
			</div>
		)
	}

});