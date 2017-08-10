/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { ContactCard } from '/modules/mixins/Members';
import { TeamActions } from '/modules/models/Teams';

/**
 * @class           TeamsPageIndex
 * @memberOf        module:models/Teams
 */
function TeamsPageIndex( props ) {
	return (
		<div className = "user-page animated fadeIn">
			<div className="ibox">
				<div className="row">
				{ props.teams.map( ( team, idx ) => {
					return (
						<div className = "col-md-4" key = { idx } >
							<div className="contact-list-item">
								<div
									className = "active-link"
									onClick = {
										() => { TeamActions.view.run( team ) }
									}
								>

									<ContactCard
										item = { team }
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

export default TeamsPageIndex;
