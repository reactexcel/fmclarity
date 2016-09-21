import React from "react";

export default function MessagesPage( props ) {
	return (
		<div>
			<div className="issue-page wrapper wrapper-content animated fadeIn">
				<div className="row">
					<div className="col-xs-12">
						<div className="ibox feed-activity-list">
							{ props.messages.map( ( message ) => {
								return (
								<div key = { message._id } className = "feed-element">
									<MessageView item = {message}/>
								</div>
								)
							}
							) }
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
