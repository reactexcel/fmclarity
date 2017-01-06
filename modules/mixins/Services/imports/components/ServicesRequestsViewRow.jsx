/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';

/**
 * @class 			ServicesProvidedEditorRow
 * @memberOf 		module:mixins/Services
 */
function ServicesRequestsViewRow( props ) {

	

	service = props.service;
	clickExpand = props.clickExpand;
	var onChange = props.onChange;
	readOnly = props.readOnly;

	return (
		<div>
			<div className="services-editor-col services-editor-col-service">

				{ clickExpand ?

					<span
						onClick 	= { clickExpand }
						className 	= "services-editor-expand-icon noprint"
					>
						<i className="fa fmc-fa-icon-expand"></i>
					</span>

				: null }

				<input
					defaultValue 	= { service || undefined }
					readOnly 		= { readOnly }
				/>

			</div>

		</div>
	)

}

export default ServicesRequestsViewRow;
