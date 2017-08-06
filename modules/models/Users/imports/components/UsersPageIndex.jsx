/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { ContactCard } from '/modules/mixins/Members';
import { TeamActions } from '/modules/models/Teams';

/**
 * @class 			UsersPageIndex
 * @memberOf 		module:models/Users
 */
function UsersPageIndex( props ) {
	let { team, users } = props;
	return (
		<div className = "user-page animated fadeIn">
			<div className="ibox">
				<div className="row">
				{ users.map( ( user, idx ) => {
					return (
						<div className = "col-sm-4" key = { idx } >
							<div className="contact-list-item">
								<div
									className = "active-link"
									onClick = {
										() => { TeamActions.viewMember.run( team, user ) }
									}
								>
									<ContactCard
										item = { user }
									/>

								</div>
							</div>
						</div>
					)
				} ) }
				</div>
			</div>
		</div>
	)
}

export default UsersPageIndex;
