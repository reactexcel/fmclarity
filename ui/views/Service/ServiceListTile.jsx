import React from "react"

ServiceListTile = React.createClass({

	render () {
		//console.log(this.props.item);
		return (
			<span>{this.props.item.name}</span>
		)
	}

})