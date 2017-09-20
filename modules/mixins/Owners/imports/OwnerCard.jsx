/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { ContactCard } from '/modules/mixins/Members';
import { UserPanel } from '/modules/models/Users';
import { TeamPanel } from '/modules/models/Teams';
import { Teams } from '/modules/models/Teams';
import { Users } from '/modules/models/Users';


/**
 * @class 			OwnerCard
 * @memberOf 		module:mixins/Owners
 */
const OwnerCard = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var q, owner, type, target;
		target = this.props.item;
		q = this.props.item.owner;
		if ( q ) {
			type = q.type;
			if ( type == "team" ) {
				owner = Teams.findOne( q._id );
			} else {
				owner = Users.findOne( q._id );
			}
		}
		return {
			owner: owner,
			target: target,
			type: type
		}
	},

	showModal( selectedUser ) {
		var type = this.data.type;
		if ( type == "team" ) {
			Modal.show( {
				content: <TeamPanel
					item = { this.data.owner }
				/>
			} )
		} else {
			console.log(this.data.owner);
			Modal.show( {
				content: <UserPanel
					item =  {this.data.owner }
					team = { this.data.target }
				/>
			} )
		}
	},

	render() {
		if ( !this.data.owner ) {
			return <div/>
		}
		return (
			<div className="active-link" onClick = { this.showModal }>
				<ContactCard item = { this.data.owner } team = { this.data.target }/>
			</div>
		)
	}
} )

export default OwnerCard;
