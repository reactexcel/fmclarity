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
            services = this.sortServices(services)

		return {
			item,
			field,
			services: services || [],
			expanded: {},
			drag: false,
            suppliers: this.props.suppliers,
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
            services = this.sortServices(services)
			this.setState( {
				item: item,
				field: field,
				services: services || [],
				expanded: {},
                suppliers: this.props.suppliers,
			} );
		}
	},

	componentDidUpdate(){
		_component = this;
	},

	componentDidMount() {
		this.save = _.debounce( this.save, 1000 );
		/*$("#sortable").sortable({
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
		$( "#sortable" ).disableSelection();*/
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
		if (newValue.name.trim() !="" && newValue.name.length >= 3) {
			this.save();
		}
		else{
			Bert.alert({
		  				title: '',
		  				message: 'Name is required and be 2 or more characters',
		  				type: 'danger',
		  				style: 'growl-bottom-right',
		  				icon: 'fa-ban'
					});
		}
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
		if (service.children[subIdx].name.trim() !="" && newValue.name.length >= 3) {
			this.save();
		}
		else{
			Bert.alert({
		  				title: '',
		  				message: 'Name is required and be 2 or more characters',
		  				type: 'danger',
		  				style: 'growl-bottom-right',
		  				icon: 'fa-ban'
					});
		}
		
	},

	addService() {
		var services = this.state.services;
		var lastIndex = services.length - 1;
		var lastService = services[ lastIndex ];
		if ( !lastService || lastService.name.length ) {
			services.push( {
				name: ""
			} );
            //services = this.sortServices(services)
			this.setState( {
				services: services
			}, () => {
                $("input#service-" + (services.length -1 )).click();
                $("input#service-" + (services.length -1 )).focus();
            } )
			// this.save();
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
            //services = this.sortServices(services)
			this.setState( {
				services: services
			}, () => {
                $("input#subservice-" + (services[idx].children.length -1 )).click();
                $("input#subservice-" + (services[idx].children.length -1 )).focus();
            } )
			// this.save();
		}
	},

	toggleExpanded( supplierName ) {
		var expanded = this.state.expanded;
		expanded[ supplierName ] = expanded[ supplierName ] ? false : true;
		this.setState( {
			expanded: expanded
		} )
	},

  handleKeyDown( event , element, selectorID, row, subRow ){
    if ( event.keyCode == 13 ) {
      let len = element.length - 1 ;
      if ( row == len || subRow == len ) {
      if( subRow >= 0 ){
        this.addSubService( row );
      } else {
        this.addService();
      }
      } else {
        console.log(((subRow||row)+1),"count",{row,subRow});
         $("input"+ selectorID +((subRow && subRow >= 0?subRow:row)+1)).click();
         $("input"+ selectorID +((subRow && subRow >= 0?subRow:row)+1)).focus();
      }
    }
  },

  sortServices(services){
      services = _.without(services, null);
      services = this.sortingFunction(services)
      services.map((s,i)=>{
          if(services[i].children && !_.isEmpty(services[i].children)){
              services[i].children = _.without(services[i].children, null);
              services[i].children = this.sortingFunction(services[i].children)
          }
      })
      return services;
  },

  sortingFunction(arr) {
      let sortedList = arr.sort( (a, b) => {
          if( a && a.name && b && b.name ) {
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          } else {
              return 0;
          }
      });
      return sortedList
  },

	render() {
		let facility = this.state.item;
        let services = this.state.services;
		let readOnly = false;
		let _component = this;
		let _services = services;
		return (
			<div className="services-editor" style={{overflow: 'hidden'}}>
				<div className="services-editor-row services-editor-row-header" style={{paddingLeft:"30px"}}>
					<div className="services-editor-col services-editor-col-header" style={{width:"70%"}}>Service</div>
					<div className="services-editor-col services-editor-col-header" style={{width:"30%"}}>Supplier</div>
				</div>
				<ul>
				{services?services.map( (service,idx) => {

					if( !service ) {
						return <li key = {idx}></li>;
					}
					let expanded = this.state.expanded[ service.name ],
						size = services.length,
						key = size+'-'+idx;

					return (
						<li key={key} className={"ui-state-default services-editor-row-li"}>
              <div className="row">
								<div style={{
    						    	width: '100%',
    							    position: 'relative'
                                }} className="col-xs-12">
									<div key={key} className={expanded?"services-editor-service-expanded":""}>
										<div className="services-editor-row">

											<ServicesRequiredEditorRow
                                                id              = {"service-"+idx}
												facility 		= { facility }
												service 		= { service }
												readOnly 		= { readOnly }
												clickExpand 	= { () => {this.toggleExpanded( service.name ) } }
												onChange 		= { (service) => {this.updateService( idx ,service)/* added @param {service} to the function */} }
                                                onKeyDown       = { evt => this.handleKeyDown( evt, services, "#service-", idx ) }
                                                suppliers       = {this.state.suppliers}
                                                sortService     = {()=>{
                                                    let s =  this.sortServices(services)
                                                    this.setState( {
                                        				services: s
                                        			})
                                                }}
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
                                                                    id={"subservice-"+subIdx}
																	facility 	= { facility }
																	service 	= { subservice }
																	readOnly 	= { readOnly }
																	onChange 	= { (service) => { this.updateSubService( idx, subIdx, service ) /* added @param {service} to the function */} }
                                                                    onKeyDown   ={ evt => this.handleKeyDown( evt, service.children, "#subservice-", idx, subIdx ) }
                                                                    suppliers   ={this.state.suppliers}
                                                                    sortService = {()=>{
                                                                        let s =  this.sortServices(services)
                                                                        this.setState( {
                                                            				services: s
                                                            			})
                                                                    }}
                                                                />
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
