import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import { Requests, RequestPanel } from '/modules/models/Requests';
import { LayoutPrint } from '/modules/core/Layouts';

export default PrintRequestContainer = createContainer( ( { selectedRequestId } ) => {

  let request = Requests.findOne(selectedRequestId),
    content = null ;
  if( request ) {
    content = <RequestPanel item={request} />
  }

	return {
		content
	}
}, LayoutPrint );
