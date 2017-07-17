/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { Facilities } from '/modules/models/Facilities';
import { Users } from '/modules/models/Users';
import { ContactCard } from '/modules/mixins/Members';
import { AutoForm } from '/modules/core/AutoForm';
import { Modal } from '/modules/ui/Modal';
import { Select } from '/modules/ui/MaterialInputs';

/**
 * @class 			ServicesRequiredEditorRow
 * @memberOf		module:mixins/Services
 */
const ServicesRequiredEditorRow = React.createClass( {

	mixins: [ ReactMeteorData ],

	getInitialState() {
		return {
		}
	},

	getMeteorData() {
		var service, supplier, suppliers, defaultContact;
		service = this.props.service;
		suppliers = this.props.suppliers;
		if ( service.data && service.data.supplier ) {
			var q = service.data.supplier;
			if ( q._id ) {
				//console.log(Teams.find({}));
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
			supplier,
		}
	},

	componentWillReceiveProps(){
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
			//this.props.facility.addSupplier( supplier );
		} else {
			service.data.supplier = null;
		}
		if ( this.props.onChange ) {
			this.props.onChange( service );
		}
	},

	updateServiceName( event ) {
		//Modal.hide();
		var service = this.data.service;
		var newValue = event?event.target.value:this.data.service.name;
		service.name = newValue;
		if ( this.props.onChange ) {
			this.props.onChange( service );
		}
	},

	showSupplierModal( supplier ) {
		var facility = Session.getSelectedFacility();
		Modal.replace( {
			content: <TeamStepper item = { supplier } facility = { facility } onChange = { this.updateSupplier }/>
		} )
	},
	removeService(){
		if(this.props.onChange){
			this.props.onChange(null);
				Modal.hide();
			}
	},

	render() {
		service = this.data.service;
		supplier = this.data.supplier;
		this.data.service.data = this.data.service.data? this.data.service.data: {};
		clickExpand = this.props.clickExpand;
		var onChange = this.props.onChange,
			component = this;
		readOnly = this.props.readOnly;
		return (
			<div>
				<div className="services-editor-col services-editor-col-service" style={{width:'70%'}}>
					{clickExpand?<span onClick={clickExpand} className="services-editor-expand-icon"><i className="fa fmc-fa-icon-expand"></i></span>:null}

		    		<input
		    			defaultValue={service.name||undefined}
		    			readOnly={readOnly}
		    			onChange={this.updateServiceName}
						onKeyDown={ (evt) => {
							this.props.onKeyDown(evt) }}
						id={this.props.id}
						onBlur={()=>{
							if(this.props.sortService){
								this.props.sortService()
							}
						}}
					/>
						{!readOnly?<span className="services-editor-delete-icon"
							onClick = {
								() => {
									localStorage.removeItem('defaultService');
									localStorage.setItem('defaultService', JSON.stringify(this.data.service));
									Modal.show({
										content:  <div style={{padding:'20px', maxWidth:"500px"}}>
											<div>
												<button style={{float:"right", color:"azure",backgroundColor:"#dd2c00"}} className="btn btn-info" onClick={this.removeService}>&times; Delete</button>
												<h1>{'Service Parameters - '+this.data.service.name}</h1>
											</div>
											<AutoForm
												model = { Facilities }
												item = { this.data.service }
												form = { ["data"] }
												onSubmit={
													( item ) => {
														component.updateServiceName(null);
														Modal.hide();
													}
												}
											/>
									</div>
								})
							} } ><i title="Configure" className="fa fa-cogs" aria-hidden="true"></i></span>:null}
					{/*!readOnly?<span title="Remove" className="services-editor-delete-icon" style={{right: "10px", fontSize: "20px"}} onClick={onChange.bind(null,null)}>&times;</span>:null*/}
				</div>
				<div style={{width:"30%", float:"left"}}>
					<div className="services-editor-col services-editor-col-supplier" style={{width:"100%",cursor: "default"}}>
						{supplier?
							<ContactCard item={supplier}/>
							:
							null
						}
					</div>
				</div>
			</div>
		)
	}
} )

export default ServicesRequiredEditorRow;
