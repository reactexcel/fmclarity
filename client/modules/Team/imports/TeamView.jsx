import React from "react";
import ActionsMenu from 'meteor/fmc:actions-menu';

export default function TeamView( props ) {
	if ( !props.item ) {
		return <TeamStepper item = { props.item } />
	}
	return <TeamPanel item = { props.item }/>
}
