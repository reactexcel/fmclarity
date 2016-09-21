import React from 'react';

import { ContactCard } from '/modules/mixins/Members';

export default function TeamsPageIndex( props ) {
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
										() => { this.showModal( team ) }
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
