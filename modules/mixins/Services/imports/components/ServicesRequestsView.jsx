/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { RequestsTable } from '/modules/models/Requests';
import ServicesRequestsViewRow from './ServicesRequestsViewRow.jsx';
/**
 * @class 			ServicesRequestsView
 * @memberOf 		module:mixins/Services
 */
class ServicesRequestsView extends React.Component {

	constructor( props ) {
		super( props );
		let { requests, labels, expandall } = props;
		//Convert requests from object to Array.
		
			if ( !_.isArray( requests ) ){
				let keys = Object.keys( requests );
				let newRequestsArray = [];
				_.forEach( keys, ( key ) => {
					newRequestsArray [ key ] = requests [ key ];
				})
				requests = newRequestsArray;
			}
		

		this.state = {
			requests: requests,
			labels: props.labels,
			expanded: {},
			expandall: props.expandall || false
		}
	}

	componentWillReceiveProps( props ) {
		
			var requests;
			requests = props.requests;
			labels=props.labels;
			this.setState( {
				requests: requests || [],
				labels: labels || [],
				expanded: {},
				expandall: props.expandall || false
			} );
		
	}

	

	toggleExpanded( supplierName ) {
		var expanded = this.state.expanded;
		expanded[ supplierName ] = expanded[ supplierName ] ? false : true;
		this.setState( {
			expanded: expanded
		} )
	}

	render() {
		var component = this;
		var requests = this.state.requests;
		var labels = this.state.labels;
		var expandall = this.state.expandall;
		var readOnly = true;
		return (
<div className="services-editor">
    <div className="services-editor-row services-editor-row-header">
        <div className="services-editor-col services-editor-col-header">Service</div>
        <div className="services-editor-col services-editor-col-header"></div>
    </div>
    {labels?labels.map(function(label,idx){ var expanded = component.state.expanded[label]; var size = labels.length; var key = size+'-'+idx; return (
    <div key={key} className={expanded || expandall? "services-editor-service-expanded" : ""}>
        <div className="services-editor-row">
            <ServicesRequestsViewRow service={label} readOnly={readOnly} clickExpand={component.toggleExpanded.bind(component,label)} />
        </div>

        <div className="services-editor-child-block">
            {expanded || expandall?
            <div>
                <div key={key} className="services-editor-row-child">
                    <RequestsTable requests={requests[label]} columns = {['Status','Facility','Amount','PO#','Issue','Issued']}/>
                </div>
            </div>
            :null}
        </div>
    </div>
    ) }):null} 
</div>
		)
	}
}

export default ServicesRequestsView;
