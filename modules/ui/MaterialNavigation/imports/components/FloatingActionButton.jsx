import React from 'react';

export default class FloatingActionButton extends React.Component {

	componentDidMount() {
		$( '.fab-panel button[rel=tooltip]' )
			.tooltip( {
				container: 'body'
			} );
	}

	render() {
		let { actions, team } = this.props;

		return (
			<div className="fab-panel">
			 { actions.map( ( actionName, idx ) => {
				 let action = FloatingActionButtonActions.actions[ actionName ]
			 	return (
					<button
						key = { idx }
						rel = "tooltip"
						data-toggle = "tooltip"
						data-placement = "left"
						title = { action.label }
						onClick = {() => { action.run( team )}}
						className = {`fab fab-${idx+1}`}>
							<i className = { action.icon }></i>
					</button>
				)
			 } ) }
			</div>
		)
	}
}
