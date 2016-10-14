/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { ContactCard } from '/modules/mixins/Members';


/**
 * @class 			ServicesRequiredEditorRow
 * @memberOf		module:mixins/Services
 */
const ServicesRequiredEditorRow = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var service, supplier;
		service = this.props.service;
		if ( service.data && service.data.supplier ) {
			var q = service.data.supplier;
			if ( q._id ) {
				supplier = Teams.findOne( q._id );
				if( !supplier && q.name ){
					supplier = Teams.findOne( {
						name: q.name
					} );
				}
			} else if ( q.name ) {
				supplier = Teams.findOne( {
					name: q.name
				} );
			}
		}
		return {
			service,
			supplier
		}
	},

	updateSupplier( supplier, event ) {
		if ( event ) {
			event.stopPropagation();
		}
		var service = this.data.service;
		if ( supplier ) {
			//I tend to think this would be better as
			//facility.setServiceSupplier(service,supplier)
			//called through the callback below
			service.data = service.data || {};
			service.data.supplier = {
					_id: supplier._id,
					name: supplier.name
				}
				//should be this.props.facility.addSupplier(supplier,{service:foo,subservice:bar})
			this.props.facility.addSupplier( supplier );
		} else {
			service.data.supplier = null;
		}
		if ( this.props.onChange ) {
			this.props.onChange( service );
		}
	},

	updateServiceName( event ) {
		var service = this.data.service;
		var newValue = event.target.value;
		service.name = newValue;
		if ( this.props.onChange ) {
			this.props.onChange( service );
		}
	},

	showSupplierModal( supplier ) {
		var facility = Session.getSelectedFacility();
		Modal.show( {
			content: <TeamStepper item={supplier} facility={facility} onChange={this.updateSupplier}/>
		} )
	},

	render() {
		service = this.data.service;
		supplier = this.data.supplier;
		clickExpand = this.props.clickExpand;
		var onChange = this.props.onChange;
		readOnly = this.props.readOnly;
		return (
			<div>
				<div className="services-editor-col services-editor-col-service">
					{clickExpand?<span onClick={clickExpand} className="services-editor-expand-icon"><i className="fa fmc-fa-icon-expand"></i></span>:null}

		    		<input
		    			defaultValue={service.name||undefined}
		    			readOnly={readOnly}
		    			onChange={this.updateServiceName}/>

			    	{!readOnly?<span className="services-editor-delete-icon" onClick={onChange.bind(null,null)}>&times;</span>:null}
				</div>
				<div className="services-editor-col services-editor-col-supplier" onClick={this.showSupplierModal.bind(this,supplier)}>
					{supplier?
						<ContactCard item={supplier}/>
					:
						null
					}
			    	{!readOnly?<span className="services-editor-delete-icon" onClick={this.updateSupplier.bind(this,null)}>&times;</span>:null}
				</div>
			</div>
		)
	}
} )

export default ServicesRequiredEditorRow;
