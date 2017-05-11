import React from 'react';
import { Facilities } from '/modules/models/Facilities';
import { Teams, TeamActions } from '/modules/models/Teams';
import { FacilityActions } from '/modules/models/Facilities';
import { MemberActions } from '/modules/mixins/Members';
import { Modal } from '/modules/ui/Modal';
import { AutoForm } from '/modules/core/AutoForm';

export default class BillingAddressDetails extends React.Component {
  constructor(props) {
    super(props);
    let { facility } = props;
    if ( facility && facility._id ) {
      facility = Facilities.findOne( { _id: facility._id } );
    }
    this.state = {
      facility: facility,
    }
  }

  setItem( item ) {
    let facility = Facilities.findOne( { _id: item._id } )
    this.setState({
      facility: facility,
    });
  }

  loadAddressForm(facility){
    $('#billingForm').toggle('display');
  }

  render() {
    let { facility } = this.state;
    let billingAddress = facility.billingDetails;

    return (
      <div className="row">
        <div className="col-sm-12">
          {billingAddress?
            <div>
              <div style={ { paddingLeft: "20px" } }>
                <h3> Billing Address </h3>
                <div onClick={() => this.loadAddressForm( facility ) } style={{paddingLeft:"10px"}}>
                  {/*<ContactCard item={facility.realEstateAgency} />*/}
                  <div>{billingAddress.company}</div>
                </div>
              </div>
              <div
                className = "contact-list-item"
                onClick   = { () => { this.loadAddressForm( facility )  } }
                style     = { { paddingLeft:"24px" } }
              >
              <span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
                <i className = "fa fa-refresh"></i>
              </span>
                  <span className = "active-link bill-address" style = {{ fontStyle:"italic" }} >
                    Change billing address
                  </span>
              </div>
            </div>
            :<div>
              <div
                className = "contact-list-item"
                onClick   = { () => { this.loadAddressForm( facility )  } }
                style     = { { paddingLeft:"24px" } }
              >
              <span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
                <i className = "fa fa-plus"></i>
              </span>
                  <span className = "active-link bill-address" style = {{ fontStyle:"italic" }} >
                    Add billing address
                  </span>
              </div>
            </div>
        }
          <div id="billingForm" style={ {display:"none", paddingLeft: "20px", paddingTop: "20px", paddingRight: "20px"} }>
                <AutoForm
                      model = { Facilities }
                      item = { facility }
                      title = "Facility Billing Address Form"
                      form = {
                        [ 'billingDetails' ] }
                      onSubmit = {
                        ( facility ) => {
                          Facilities.save.call( facility );
                          this.loadAddressForm( facility )
                        }
                      }

                />
          </div>
        </div>
      </div>
    );
  }
}
