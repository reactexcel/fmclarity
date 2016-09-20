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
				<button 
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new work request"
					onClick={() => { actions.run('create request')}} 
					className="fab fab-1">
						+
				</button>
				<button 
					style = { {backgroundColor:"red", color:"#fff"} }
					rel = "tooltip"
					data-toggle = "tooltip" 
					data-placement = "left" 
					title = "Create new facility"
					onClick = { () => { actions.run('create facility') } } 
					className = "fab fab-2">
						<i className="fa fa-building"></i>
				</button>				
				<button 
					style={{backgroundColor:"orange",color:"#fff"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new compliance rule"
					onClick={ () => { actions.run('create request')} } 
					className="fab fab-3">
						<i className="fa fa-check"></i>
				</button>
				<button 
					style={{backgroundColor:"yellow",color:"#333"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new preventative maintenence event"
					onClick={ () => { actions.run('create request') } }
					className="fab fab-4">
						<i className="fa fa-recycle"></i>
				</button>				
				<button 
					style={{backgroundColor:"green",color:"#fff"}}
					rel="tooltip"
					data-toggle="tooltip" 
					data-placement="left" 
					title="Create new document"
					onClick={ () => { actions.run('create document') } } 
					className="fab fab-5">
						<i className="fa fa-file"></i>
				</button>				
			</div>
		)
	}
}
