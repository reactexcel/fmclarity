/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Actions, Routes } from '/modules/core/Actions';

import { Users } from '/modules/models/Users';
import { Issues } from '/modules/models/Requests';
import { UserFilter } from '/modules/mixins/Members';
import { UserPanel } from '/modules/models/UserViews';
import { Teams, TeamFilter } from '/modules/models/Teams';
import { Facilities, FacilityFilter } from '/modules/models/Facilities';

/**
 * @class 			AdminPageIndex
 * @memberOf 		module:features/Admin
 */
const AdminPageIndex = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		Meteor.subscribe( 'Users' );
		Meteor.subscribe( 'Facilities' );
		Meteor.subscribe( 'Documents' );
		Meteor.subscribe( 'Files' );
		Meteor.subscribe( 'Messages' );
		Meteor.subscribe( 'Requests' );
		Meteor.subscribe( 'Notifications' );

		let user = Meteor.user(),
			users = Users.findAll( {}, { sort: { 'profile.lastName': 1 } } ),
			team = Session.getSelectedTeam(),
			teams = Teams.findAll( {}, { sort: { name: 1 } } ),
			facility = Session.getSelectedFacility(),
			facilities = Facilities.findAll( {}, { sort: { name: 1 } } ),
			request = Issues.findOne( { name: { $exists: true } } );


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

	getArgs( types ) {
		let args = [];
		if ( !_.isArray( types ) ) {
			types = [ types ];
		}
		types.map( ( type, idx ) => {
			args[ idx ] = this.data[ type ];
		} )
		return args;
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
					<div className="ibox">
						<UserPanel item = { user } />
					</div>
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
										args = this.getArgs(type),
										access = Actions.checkAccess( key, args[0]); // refact should be ...args

									return (
										<tr className = "data-grid-row" key = { key }>
											<td className = "data-grid-select-col"></td>
											<td className = "data-grid-cell" onClick={ () => {
												Actions.run( key, ...args );
											} }>{key} ({
												args.map( (arg, idx) => {
													return <span key = { idx }>{ arg?arg.name||arg.profile.name:'null' }, </span>
												})
											})</td>
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

export default AdminPageIndex;
