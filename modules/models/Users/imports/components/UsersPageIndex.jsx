import React from 'react';

import { ContactCard } from '/modules/mixins/Members';

export default function UsersPageIndex( props ) {
	return (
		<div className = "user-page animated fadeIn">
			<div className="ibox">
				<div className="row">
				{ props.users.map( ( user, idx ) => {
					return (
						<div className = "col-sm-4" key = { idx } >
							<div className="contact-list-item">
								<div 
									className = "active-link" 
									onClick = { 
										() => { this.showModal( user ) }
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
