FacilitySummary = React.createClass({

	getInitialState() {
		return {
			expanded:false
		}
	},

	render() {
	    var facility = this.props.item || {};
	    var contact = facility.contact || {};
	    return (
	    	<div>
	    		{/*
				<div style={{marginTop:"10px",width:"25px",float:"left"}}>
					<input type="checkbox" />
				</div>*/}
				<div className="facility-thumbnail pull-left">
				    <img style={{width:"40px"}} alt="image" src={"img/"+facility.thumb} />
				 </div>
				 <div className="facility-info">
					<a href="#">
						{facility.name}
					</a>
					<br/>
					<span style={{fontSize:"11px",color:"#777"}}>
						<b style={{color:"#000"}}>Contact </b>
						{contact.name}&nbsp;&nbsp;
						<i className="fa fa-envelope"></i>&nbsp;&nbsp;
						{contact.email}&nbsp;&nbsp;
						<i className="fa fa-phone"></i>&nbsp;&nbsp;
						{contact.phone}
					</span>
			    </div>
			</div>
		)
	}

});