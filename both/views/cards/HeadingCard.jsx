HeadingCard = React.createClass({
	render() {
		var item = this.props.item;
		return (
			<h4 style={{margin:0}}>{item.service.name}</h4>
		)
	}
});