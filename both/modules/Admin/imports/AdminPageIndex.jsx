import React from 'react';

import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Actions, Routes } from '/modules/core/Action';

import { Users } from '/modules/models/User';
import { Teams, TeamFilter } from '/modules/models/Team';
import { Facilities, FacilityFilter } from '/modules/models/Facility';
import {UserFilter} from '/modules/model-mixins/Members';

import { Issues } from '/modules/models/Request';

console.log( Routes );
console.log( Actions );

export default AdminPageIndex = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		Meteor.subscribe( 'Users' );
		Meteor.subscribe( 'Facilities' );
		Meteor.subscribe( 'Documents' );
		Meteor.subscribe( 'Files' );
		Meteor.subscribe( 'Messages' );
		Meteor.subscribe( 'Requests' );

		let user = Meteor.user(),
			users = Users.findAll(),
			team = Session.getSelectedTeam(),
			teams = Teams.findAll(),
			facility = Session.getSelectedFacility(),
			facilities = Facilities.findAll(),
			request = Issues.findOne({name:{$exists:true}});


		return {
			user,
			users,
			team,
			teams,
			facility,
			facilities,
			request,
		}
	},

	render() {

		let { user, users, team, teams, facility, facilities, request } = this.data;

		if ( !team ) {
			return <div/>
		}

		let routeKeys = Object.keys( Routes.actions ),
			actionKeys = Object.keys( Actions.actions );

		routeKeys.sort();
		actionKeys.sort();

		return (
			<div>

			<div className = "row">

				<div className = "col-md-6">
					<UserFilter selectedItem = { user } items = { users }/>
					<TeamFilter selectedItem = { team } items = { teams }/>
					<FacilityFilter selectedItem = { facility } items = { facilities }/>
				</div>

				<div className = "col-md-6">
				</div>

			</div>

			<div className = "row">

				<div className = "col-md-6">
					<div className = "ibox">
						<div className = "data-grid">
							<table className = "table">
							<tbody>
								<tr className = "data-grid-header-row">
									<td className = "data-grid-select-col-header"></td>
									<td className = "data-grid-header-cell">Route</td>
									<td className = "data-grid-header-cell">Allowed</td>
								</tr>
								{ routeKeys.map( ( key ) => {
									let route = Routes.actions[ key ],
										access = Routes.checkAccess( key, team );

									return (
										<tr key = { key } className = "data-grid-row">

											<td className = "data-grid-select-col"></td>

											<td className = "data-grid-cell" onClick={ () => {
												Routes.run( key );
											} }>
												{route.path}
											</td>

											<td className = "data-grid-cell">{ access.allowed?'✔':'' }</td>

										</tr>
									)
								} ) }
							</tbody>
							</table>
						</div>
					</div>
				</div> 

				<div className = "col-md-6">
					<div className = "ibox">
						<div className = "data-grid">
							<table className = "table">
							<tbody>
								<tr className = "data-grid-header-row">
									<td className = "data-grid-select-col-header"></td>
									<td className = "data-grid-header-cell">Action</td>
									<td className = "data-grid-header-cell">Allowed</td>
									<td className = "data-grid-header-cell">Alert</td>
									<td className = "data-grid-header-cell">Email</td>
								</tr>
								{ actionKeys.map( ( key ) => {
									let type = Actions.getType( key ),
										arg = this.data[type],
										access = Actions.checkAccess( key, arg );

									return (
										<tr className = "data-grid-row" key = { key }>
											<td className = "data-grid-select-col"></td>
											<td className = "data-grid-cell" onClick={ () => {
												Actions.run( key, arg );
											} }>{key} ({ type }:{ arg?arg.name:'null' })</td>
											<td className = "data-grid-cell">{ access.allowed?'✔':'' }</td>
											<td className = "data-grid-cell">{ access.alert?'✔':'' }</td>
											<td className = "data-grid-cell">{ access.email?'✔':'' }</td>
										</tr>
									)
								} ) }
							</tbody>
							</table>

						</div>
					</div>
				</div>
			</div>
		</div>
		)
	}

} )
