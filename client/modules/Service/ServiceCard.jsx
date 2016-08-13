import React from 'react';
class ServiceCard extends React.Component {
	render() {
		return (
			<ServiceViewDetail item={this.props.item}/>
		)
	}
}