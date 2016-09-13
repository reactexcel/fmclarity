import React from "react";

import FileView from './FileView.jsx';

export default function FilesPageIndex( props ) {

	return (
		<div>
			<div className="row wrapper page-heading">
			  <div className="col-lg-12">
				{/*<FacilityFilter title="Requests"/>*/}
			  </div>
			</div>
			{/*newItemCallback could be a collection helper - then we pass in the collection to the filterbox*/}
			<div className="issue-page wrapper wrapper-content animated fadeIn">
				<div className="ibox">
					<div>
					{ props.items.map( ( item, idx ) => {
						return (
							<div key = { idx } style = { { display:"inline-block" } } >
			 					<FileView item = { item } />
			 				</div>
			 			)
					} ) }
					</div>
				</div>
			</div>
		</div>
	)
}
