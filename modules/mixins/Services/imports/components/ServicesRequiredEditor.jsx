/**
 * @author      Leo Keith <leo@fmclarity.com>
 * @copyright    2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import ServicesRequiredEditorRow from './ServicesRequiredEditorRow.jsx';

/**
 * @class      ServicesRequiredEditor
 * @memberOf    module:mixins/Services
 */

const ServicesRequiredEditor = React.createClass({

  oldServices: null,
  updatedService: null,

  getInitialState() {
    let item = this.props.item || this.state.item;
    let field = this.props.field || 'servicesRequired';
    let services = this.sortServices(item && field ? item[field] : []);

    this.oldServices = JSON.parse(JSON.stringify(services));

    return {
      item,
      field,
      services: services || [],
      expanded: {},
      drag: false,
      suppliers: this.props.suppliers,
    };
  },

  componentWillReceiveProps(props) {
    // only update if the item (facility) being displayed has changed
    // this means the item will fail to refresh if updated by another client
    // a deep comparison could prevent this (if it is deemed worthwhile)
    if (props.item._id != this.state.item._id) {
      let item = props.item;
      let field = props.field || 'servicesRequired';
      let services = item && field ? item[field] : [];
      services = this.sortServices(services);
      this.setState({
        item: item,
        field: field,
        services: services || [],
        expanded: {},
        suppliers: this.props.suppliers,
      });
    }
  },

  componentDidUpdate() {

  },

  componentDidMount() {
    this.save = _.debounce(this.save, 1000);
  },

  save() {
    let item = this.state.item;
    let services = this.state.services;
    item.setServicesRequired(services, this.updatedService);

    this.oldServices = JSON.parse(JSON.stringify(services));
    this.updatedService = null;
    /* or???
     if(this.props.onChange) {
     this.props.onChange(this.state.services);
     }
     */
  },

  updateService(idx, newValue) {
    let services = this.state.services;
    if (!newValue) {
      services.splice(idx, 1);
    } else {
      services[idx] = this.updateRuleServiceNames(newValue);
      this.updatedService = {
        oldValue: this.oldServices[idx],
        newValue: newValue,
        parent: null,
      };
    }
    this.setState({
      services: services,
    });

    if (services[idx] && services[idx].name &&
      services[idx].name.trim() !== '') {
      this.save();
    } else {
      Bert.alert({
        title: '',
        message: 'Name is required and be 2 or more characters',
        type: 'danger',
        style: 'growl-bottom-right',
        icon: 'fa-ban',
      });
    }
  },

  updateSubService(idx, subIdx, newValue) {
    let services = this.state.services;
    let service = services[idx];
    if (!newValue) {
      service.children.splice(subIdx, 1);
    } else {
      service.children[subIdx] = this.updateRuleSubServiceNames(newValue);
      this.updatedService = {
        oldValue: this.oldServices[idx].children[subIdx],
        newValue: newValue,
        parent: service,
      };
    }
    services[idx] = service;
    this.setState({
      services: services,
    });
    if (service.children[subIdx] && service.children[subIdx].name &&
      service.children[subIdx].name.trim() !== '') {
      this.save();
    } else {
      Bert.alert({
        title: '',
        message: 'Name is required and be 2 or more characters',
        type: 'danger',
        style: 'growl-bottom-right',
        icon: 'fa-ban',
      });
    }
  },

  updateRuleServiceNames(newService) {
    if (newService.data.complianceRules) {
      if (newService.data.complianceRules.length > 0) {
        for (let key in newService.data.complianceRules) {
          newService.data.complianceRules[key].service.name = newService.name;
        }
      }
    }

    if (newService.children.length > 0) {
      for (let key in newService.children) {
        if (newService.children[key].data.complianceRules) {
          for (let key1 in newService.children[key].data.complianceRules) {
            newService.children[key].data.complianceRules[key1].service.name = newService.name;
          }
        }
      }
    }

    return newService;
  },

  updateRuleSubServiceNames(newService) {
    if (newService.data.complianceRules) {
      if (newService.data.complianceRules.length > 0) {
        for (let key in newService.data.complianceRules) {
          newService.data.complianceRules[key].service.name = newService.name;
        }
      }
    }

    return newService;
  },

  addService() {
    let services = this.state.services;
    let lastIndex = services.length - 1;
    let lastService = services[lastIndex];
    if (!lastService || lastService.name.length) {
      services.push({
        name: '',
      });

      this.setState({
        services: services,
      }, () => {
        $('input#service-' + (services.length - 1 )).click();
        $('input#service-' + (services.length - 1 )).focus();
      });
      // this.save();
    }
  },

  addSubService(idx) {
    let services = this.state.services;
    let service = services[idx];
    service.children = service.children || [];
    let lastIndex = service.children.length - 1;
    let lastSubService = service.children[lastIndex];
    if (!lastSubService || lastSubService.name.length) {
      services[idx].children.push({
        name: '',
      });

      this.setState({
        services: services,
      }, () => {
        $('input#subservice-' + (services[idx].children.length - 1 )).click();
        $('input#subservice-' + (services[idx].children.length - 1 )).focus();
      });
    }
  },

  toggleExpanded(supplierName) {
    let expanded = this.state.expanded;
    expanded[supplierName] = expanded[supplierName] ? false : true;
    this.setState({
      expanded: expanded,
    });
  },

  handleKeyDown(event, element, selectorID, row, subRow) {
    if (event.keyCode == 13) {
      let len = element.length - 1;
      if (row == len || subRow == len) {
        if (subRow >= 0) {
          this.addSubService(row);
        } else {
          this.addService();
        }
      } else {
        console.log(((subRow || row) + 1), 'count', {row, subRow});
        let elem = $('input' + selectorID +
          ((subRow && subRow >= 0 ? subRow : row) + 1));
        elem.click();
        elem.focus();
      }
    }
  },

  sortServices(services) {
    services = _.without(services, null);
    services = this.sortingFunction(services);
    services.map((s, i) => {
      if (services[i].children && !_.isEmpty(services[i].children)) {
        services[i].children = _.without(services[i].children, null);
        services[i].children = this.sortingFunction(services[i].children)
      }
    });
    return services;
  },

  sortingFunction(arr) {
    return arr.sort((a, b) => {
      if (a && a.name && b && b.name) {
        let textA = a.name.toUpperCase();
        let textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      } else {
        return 0;
      }
    });
  },

  render() {
    let facility = this.state.item;
    let services = this.state.services;
    let readOnly = false;
    return (
      <div className="services-editor" style={{overflow: 'hidden'}}>
        <div className="services-editor-row services-editor-row-header"
             style={{paddingLeft: '30px'}}>
          <div className="services-editor-col services-editor-col-header"
               style={{width: '70%'}}>Service</div>
          <div className="services-editor-col services-editor-col-header"
               style={{width: '30%'}}>Supplier</div>
        </div>
        <ul>
          {services ? services.map((service, idx) => {

            if (!service) {
              return null;
            }
            let expanded = this.state.expanded[service.name];
            let size = services.length;
            let key = size + '-' + idx;

            return (
              <li key={key} className="ui-state-default services-editor-row-li">
                <div className="row">
                  <div style={{
                    width: '100%',
                    position: 'relative',
                  }} className="col-xs-12">
                    <div key={key} className={expanded ?
                      'services-editor-service-expanded' : ''}>
                      <div className="services-editor-row">

                        <ServicesRequiredEditorRow
                          id={'service-' + idx}
                          facility={ facility }
                          service={ service }
                          readOnly={ readOnly }
                          clickExpand={ () => {
                            this.toggleExpanded(service.name)
                          } }
                          onChange={ (service) => {
                            this.updateService(idx, service)
                            /* added @param {service} to the function */
                          } }
                          onKeyDown={ evt => this.handleKeyDown(evt, services, "#service-", idx) }
                          suppliers={this.state.suppliers}
                          sortService={() => {
                            let s = this.sortServices(services);
                            this.setState({
                              services: s
                            })
                          }}
                        />

                      </div>

                      <div className="services-editor-child-block">
                        {expanded ?
                          <div>
                            {service.children ? service.children.map((subService, subIdx) => {
                              let size = service.children.length;
                              let key = size + '-' + subIdx;
                              return (
                                <div key={key} className="services-editor-row services-editor-row-child">
                                  <ServicesRequiredEditorRow
                                    id={"subservice-" + subIdx}
                                    facility={ facility }
                                    service={ subService }
                                    readOnly={ readOnly }
                                    onChange={ (service) => {
                                      this.updateSubService(idx, subIdx, service)
                                      /* added @param {service} to the function */
                                    } }
                                    onKeyDown={ evt => this.handleKeyDown(evt, service.children, "#subservice-", idx, subIdx) }
                                    suppliers={this.state.suppliers}
                                    sortService={() => {
                                      let s = this.sortServices(services)
                                      this.setState({
                                        services: s
                                      })
                                    }}
                                  />
                                </div>
                              )
                            }) : null}
                            {!readOnly ?
                              <div onClick={ () => {
                                this.addSubService(idx)
                              } } className="services-editor-row services-editor-row-child"
                                   style={{fontSize: "smaller", fontStyle: "italic"}}>
                                <span style={{position: "absolute", left: "15px", top: "15px"}}><i className="fa fa-plus"/></span>
                                <span style={{position: "absolute", left: "48px", top: "15px"}} className="active-link">Add subservice</span>
                              </div>
                              : null}
                          </div>
                          : null}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          }) : null}
        </ul>
        {!readOnly ?
          <div onClick={this.addService} className="services-editor-row" style={{fontStyle: "italic"}}>
            <span style={{position: "absolute", left: "15px", top: "15px"}}><i className="fa fa-plus"></i></span>
            <span style={{position: "absolute", left: "48px", top: "15px"}} className="active-link">Add service</span>
          </div>
          : null}
      </div>
    )
  }
});

export default ServicesRequiredEditor;
