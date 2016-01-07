
FacilityWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={FacilityEdit}
				back={FacilityView}
				item={this.props.item}
			/>
		)
	}
});