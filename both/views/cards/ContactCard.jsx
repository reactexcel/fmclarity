ContactCard = React.createClass({
	render() {
		var contact = this.props.contact;
		var view = this.props.view;
		switch(view) {
			case '2-line':return (
				<div className="contact-card contact-card-2line">
					<div className="contact-card-avatar">
						<img alt="image" src={"img/"+contact.thumb}/>
					</div>
					<div className="contact-card-2line-text">
			            {contact.name}<br/>
			            <i className="fa fa-envelope"></i>&nbsp;&nbsp;{contact.email}
			       	</div>
	           	</div>
			);
			default:return (
	            <small className="contact-card contact-card-1line">
	              {contact.name}&nbsp;&nbsp;
	              <i className="fa fa-envelope"></i>&nbsp;&nbsp;
	              {contact.email}&nbsp;&nbsp;
	              <i className="fa fa-phone"></i>&nbsp;&nbsp;
	              {contact.phone}
	            </small>
	        );
		}
	}
})