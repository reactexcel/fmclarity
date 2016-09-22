import React from "react";
import { Menu } from '/modules/ui/MaterialNavigation';

import TeamPanel from './TeamPanel.jsx';
import TeamStepper from './TeamStepper.jsx';

export default function TeamView( props ) {
	if ( !props.item ) {
		return <TeamStepper item = { props.item } />
	}
	return <TeamPanel item = { props.item }/>
}
