import React from 'react';
//import { Menus } from '/modules/core/Actions';

import { Menus } from '/modules/core/Menus';

export default class FloatingActionButton extends React.Component {

    componentDidMount() {
        $( '.fab-panel button[rel=tooltip]' )
            .tooltip( {
                container: 'body'
            } );
    }

    render() {
        let { actions, team } = this.props;
        let user = Meteor.user();
        if (user) {
            if ( user.getRole() !== "fmc support" ) {
                actions = _.filter(actions, ( action ) => {
                    return action !== 'create team';
                }  )
            }
        }
        return (
            <div className="fab-panel noprint" id="fab">
			 { actions.map( ( actionName, idx ) => {
				 let action = Menus.FloatingActionButtonActions.actions[ actionName ]
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
