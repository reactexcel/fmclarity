HeadingCard = React.createClass({
	render() {
		var item = this.props.item;
		return (
			<div className="card">
				<div className="card-header">
					<h4 style={{margin:0}}>{item.service.name}</h4>
				</div>
				<div className="card-body">
				</div>
			</div>
		)
	}
});