FacilityCard = React.createClass({

	handleNameChange(event) {
		this.props.handleFieldChange('name',event.target.value);
	},

	handleAddressChange(event) {
		this.props.handleFieldChange('address',event.target.value);
	},

	render() {
	    var facility = this.props.item;
	    var contact = facility.contact;
	    return (
	    	<div>
				<div className="card-header">
					<div className="facility-thumbnail pull-left">
				        <img style={{width:"40px","borderRadius":"2px"}} alt="image" src={"img/building-"+facility.thumb+".jpg"} />
				 	</div>
					<div className="facility-type pull-right" style={{width:"100px","textAlign":"left"}}>
						<span className="label label-warning">{facility.type}</span>
					</div>
				 	<div className="facility-info">
						<a href="#">
							{facility.name}
						</a>
						<br/>
						<small>
							{contact.name}&nbsp;&nbsp;
							<i className="fa fa-envelope"></i>&nbsp;&nbsp;
							{contact.email}&nbsp;&nbsp;
							<i className="fa fa-phone"></i>&nbsp;&nbsp;
							{contact.phone}
						</small>
			        </div>
				</div>
				<div className="card-body">
					<div className="facility-thumbnail pull-left">
				        <img style={{width:"200px","borderRadius":"2px"}} alt="image" src={"img/building-"+facility.thumb+".jpg"} />
				 	</div>
					<div className="facility-type pull-right">
						<span className="label label-warning">{facility.type}</span>
					</div>
					<form style={{float:"left",paddingLeft:"20px"}} className="form-horizontal">
						<input className="form-control" value={facility.name} onChange={this.handleNameChange}/>
						<input className="form-control" value={facility.address} onChange={this.handleAddressChange}/>
						{/*<ContactForm contact={facility.contact} />*/}
					</form>
				</div>
			</div>
		)
	}

});