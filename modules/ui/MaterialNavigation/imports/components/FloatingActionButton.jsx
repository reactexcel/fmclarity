import React from 'react';

export default class FloatingActionButton extends React.Component {

	componentDidMount() {
		$( '.fab-panel button[rel=tooltip]' )
			.tooltip( {
				container: 'body'
			} );
	}

	render() {
		let { actions } = this.props;

		return (
			<div className="fab-panel">
			 { actions.map( ( action, idx ) => {
			 	return (
					<button 
						key = { idx }
						rel = "tooltip"
						data-toggle = "tooltip" 
						data-placement = "left" 
						title = { action.label }
						onClick = {() => { action.run()}} 
						className = {`fab fab-${idx+1}`}>
							<i className = { action.icon }></i>
					</button>
				)
			 } ) }
			</div>
		)
	}
}
