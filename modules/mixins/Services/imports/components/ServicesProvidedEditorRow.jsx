/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import { Switch } from '/modules/ui/MaterialInputs';

/**
 * @class 			ServicesProvidedEditorRow
 * @memberOf 		module:mixins/Services
 */
function ServicesProvidedEditorRow( props ) {

	function updateServiceName( event ) {
		var service = props.service;
		var newValue = event.target.value;
		service.name = newValue;
		if ( props.onChange ) {
			props.onChange( service );
		}
	}

	function toggleActive( value ) {
		var service = props.service;
		var newValue = value;
		service.active = newValue;
		if ( props.onChange ) {
			props.onChange( service );
		}
	}

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
						className 	= "services-editor-expand-icon"
					>
						<i className="fa fmc-fa-icon-expand"></i>
					</span>

				: null }

				<input
					defaultValue 	= { service.name || undefined }
					readOnly 		= { readOnly }
					onChange 		= { updateServiceName }
				/>

				{ !readOnly ?

					<span
						className 	= "services-editor-delete-icon"
						onClick 	= { () => { onChange(null) } }
					>
						&times;
					</span>

				: null }

			</div>

			<div
				className 			= "services-editor-col services-editor-col-supplier"
				style 				= { { padding:"10px" } }
			>
				<Switch
					value 			= { service.active }
					onChange 		= { toggleActive }
				>

					<b>Active</b>

				</Switch>

			</div>

		</div>
	)

}

export default ServicesProvidedEditorRow;
