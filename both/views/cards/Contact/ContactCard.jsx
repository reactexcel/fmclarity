ContactViewName = React.createClass({
	render() {
		var contact = this.props.item || {};
		return (
			<span>{contact.name}</span>
		)
	}
})

ContactCard = React.createClass({
	render() {
		var contact = this.props.item || {};
		var view = this.props.view;
		switch(view) {
			case 'avatar':return (
				<div className="contact-card-avatar">
					<img alt="image" title={contact.name} data-toggle="tooltip" src={"img/"+contact.thumb}/>
				</div>
			);
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