/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import ServicesRequiredEditorRow from './ServicesRequiredEditorRow.jsx';

/**
 * @class 			ServicesRequiredEditor
 * @memberOf 		module:mixins/Services
 */
 var _component = _services = null
const ServicesRequiredEditor = React.createClass( {

	getInitialState() {

		let item = this.props.item || this.state.item,
			field = this.props.field || "servicesRequired",
			services = item && field ? item[ field ] : [];

		return {
			item,
			field,
			services: services || [],
			expanded: {},
			drag: false,
		}
	},

	componentWillReceiveProps( props ) {
		//only update if the item (facility) being displayed has changed
		//this means the item will fail to refresh if updated by another client
		//a deep comparison could prevent this (if it is deemed worthwhile)
		if ( props.item._id != this.state.item._id ) {
			var item, field, services;
			item = props.item;
			field = props.field || "servicesRequired";
			services = item && field ? item[ field ] : [];
			this.setState( {
				item: item,
				field: field,
				services: services || [],
				expanded: {}
			} );
		}
	},

	componentDidUpdate(){
		_component = this;
	},

	componentDidMount() {
		this.save = _.debounce( this.save, 1000 );
		$("#sortable").sortable({
			stop: function(event, ui) {
				console.log( { val: ui.item.val() } );
				console.log(parseInt(ui.position.top / ui.item.height()) -2 );
				console.log( ui.position.top  );
				let startIndex = ui.item.val(),
					stopIndex = parseInt(ui.position.top / ui.item.height()) -2,
					temp = null,
					row = _services;
					temp = row[startIndex];
					//sort Top-Dowm
					if ( startIndex < stopIndex ) {
						for(var i = startIndex; i <= stopIndex; i++) {
							row[i] = row[i+1];
						}
						row[stopIndex] = temp;
					}
					//sort Bottom-UP
					if ( startIndex > stopIndex ) {
						for(var i = startIndex + 1; i >= stopIndex; i--) {
							row[i] = row[i-1];
						}
						row[stopIndex] = temp;
					}
					_component.setState({
						services: row,
					});
					_component.save();
			},
			placeholder: "ui-state-highlight",
			axis: "y",
		});
		$( "#sortable" ).disableSelection();
	},

	save() {
		var item = this.state.item;
		var services = this.state.services;
		item.setServicesRequired( services );
		/* or???
		if(this.props.onChange) {
			this.props.onChange(this.state.services);
		}
		*/
	},

	updateService( idx, newValue ) {
		var services = this.state.services;
		if ( !newValue ) {
			services.splice( idx, 1 );
		} else {
			services[ idx ] = newValue;
		}
		this.setState( {
			services: services
		} )
		this.save();
	},

	updateSubService( idx, subIdx, newValue ) {
		var services = this.state.services;
		var service = services[ idx ];
		if ( !newValue ) {
			service.children.splice( subIdx, 1 );
		} else {
			service.children[ subIdx ] = newValue;
		}
		services[ idx ] = service;
		this.setState( {
			services: services
		} )
		this.save();
	},

	addService() {
		var services = this.state.services;
		var lastIndex = services.length - 1;
		var lastService = services[ lastIndex ];
		if ( !lastService || lastService.name.length ) {
			services.push( {
				name: ""
			} );
			this.setState( {
				services: services
			} )
			this.save();
		}
	},

	addSubService( idx ) {
		var services = this.state.services;
		var service = services[ idx ];
		service.children = service.children || [];
		var lastIndex = service.children.length - 1;
		var lastSubService = service.children[ lastIndex ];
		if ( !lastSubService || lastSubService.name.length ) {
			services[ idx ].children.push( {
				name: ""
			} );
			this.setState( {
				services: services
			} )
			this.save();
		}
	},

	toggleExpanded( supplierName ) {
		var expanded = this.state.expanded;
		expanded[ supplierName ] = expanded[ supplierName ] ? false : true;
		this.setState( {
			expanded: expanded
		} )
	},

	render() {
		let facility = this.state.item;
		services = this.state.services;
		readOnly = false;
		_component = this;
		_services = services;
		return (
			<div className="services-editor">
				<div className="services-editor-row services-editor-row-header">
					<div className="services-editor-col services-editor-col-header">Service</div>
					<div className="services-editor-col services-editor-col-header">Supplier</div>
				</div>
				<ul id="sortable">
				{services?services.map( (service,idx) => {

					let expanded = this.state.expanded[service.name],
						size = services.length,
						key = size+'-'+idx;

					return (
						<li key={key} className={"ui-state-default services-editor-row-li"}>
								<div style={{
										height:'48px',
										width: '2%,'
									}}>
									<span className="reorder">
										<i className="fa fa-bars fa-2x reorder" aria-hidden="true"></i>
									</span>
								</div>
								<div style={{
    							width: '97%',
    							position: 'relative',
    							bottom: '48px',
    							left: '3%',
									}}>
									<div key={key} className={expanded?"services-editor-service-expanded":""}>
										<div className="services-editor-row">

											<ServicesRequiredEditorRow
												facility 		= { facility }
												service 		= { service }
												readOnly 		= { readOnly }
												clickExpand 	= { () => { this.toggleExpanded( service.name ) } }
												onChange 		= { (service) => { this.updateService( idx ,service) /* added @param {service} to the function */} }
											/>

										</div>

										<div className="services-editor-child-block">
											{expanded?
												<div>
													{service.children?service.children.map( (subservice,subIdx) => {
														var size=service.children.length;
														var key = size+'-'+subIdx;
														return (
															<div key={key} className="services-editor-row services-editor-row-child">
																<ServicesRequiredEditorRow
																	facility 	= { facility }
																	service 	= { subservice }
																	readOnly 	= { readOnly }
																	onChange 	= { (service) => { this.updateSubService( idx, subIdx, service ) /* added @param {service} to the function */} }/>
															</div>
														)
													}):null}
													{!readOnly?
												    	<div onClick={ () => { this.addSubService( idx ) } } className="services-editor-row services-editor-row-child" style={{fontSize:"smaller",fontStyle:"italic"}}>
															<span style={{position:"absolute",left:"15px",top:"15px"}}><i className="fa fa-plus"></i></span>
														    <span style={{position:"absolute",left:"48px",top:"15px"}} className="active-link">Add subservice</span>
													    </div>
													:null}
												</div>
											:null}
										</div>
									</div>
								</div>
						</li>
					)
				}):null}
				</ul>
				{!readOnly?
				    <div onClick={this.addService} className="services-editor-row" style={{fontStyle:"italic"}}>
						<span style={{position:"absolute",left:"15px",top:"15px"}}><i className="fa fa-plus"></i></span>
					    <span style={{position:"absolute",left:"48px",top:"15px"}} className="active-link">Add service</span>
					</div>
				:null}
			</div>
		)
	}
} )

export default ServicesRequiredEditor;
