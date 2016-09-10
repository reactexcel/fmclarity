import React from "react";

import DocIcon from './DocIcon.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import Documents from '../models/Documents.jsx';

export default function DocsPageIndex( props ) {

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
					<DocIconHeader/>
					<div>
					{ props.docs.map( ( doc ) => {
		 				return <DocIcon key={doc._id} item={doc}/>
					} ) }
					</div>
				</div>
			</div>
		</div>
	)
}
