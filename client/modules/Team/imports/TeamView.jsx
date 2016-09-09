import React from "react";
import { Menu } from 'meteor/fmc:material-navigation';

export default function TeamView( props ) {
	if ( !props.item ) {
		return <TeamStepper item = { props.item } />
	}
	return <TeamPanel item = { props.item }/>
}
