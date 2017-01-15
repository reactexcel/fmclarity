import React, {PropTypes} from 'react';
import { Switch } from '/modules/ui/MaterialInputs';
import { Facilities } from '/modules/models/Facilities';
import { Teams, TeamActions } from '/modules/models/Teams';
import { FacilityActions } from '/modules/models/Facilities';
import { ContactCard, MemberActions } from '/modules/mixins/Members'

export default class PropertyManagerDetails extends React.Component {
  constructor(props) {
    super(props);
    let { facility } = props;
    if ( facility && facility._id ) {
      facility = Facilities.findOne( { _id: facility._id } );
    }
    this.state = {
      facility,
      allow: facility.allowProrertyManager,
    }
  }

  setItem( item ) {
    let facility = Facilities.findOne( { _id: item._id } )
    this.setState({
      facility,
      allow: facility.allowProrertyManager,
    });
  }

  render() {
    let { facility, allow } = this.state;
    let realEstateAgency = facility.realEstateAgency,
      propertyManagers = [],
      team = Session.getSelectedTeam();
    if ( realEstateAgency ) {
      realEstateAgency = Teams.findOne( { _id: realEstateAgency._id } );
      propertyManagers = realEstateAgency.getMembers({role: "property manager"});
    }
    return (
      <div className="row">
        <div className="col-sm-12">
          {realEstateAgency?
            <div>
              <div style={ { paddingLeft: "20px" } }>
                <h3> Real Estate Agency </h3>
                <div onClick={() => TeamActions.view.run( realEstateAgency ) } style={{paddingLeft:"10px"}}>
                  <ContactCard item={facility.realEstateAgency} />
                </div>
              </div>
              <div style={ { paddingLeft: "20px" } }>
                <h3> Property Manager </h3>
                {_.map(propertyManagers, ( pm, i ) => (
                  <div onClick={() => MemberActions.view.run(team, pm ) } key={i} style={{paddingLeft:"10px", paddingBottom: "10px"}}>
                    <ContactCard item={pm} />
                  </div>
                ))}
              </div>
              <div
                className	= "contact-list-item"
                onClick		= { () => { FacilityActions.createPropertyManager.run( facility, this.setItem.bind(this) )  } }
                style 		= { { paddingLeft:"24px" } }
              >
              <span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
                <i className = "fa fa-refresh"></i>
              </span>
                  <span className = "active-link" style = {{ fontStyle:"italic" }} >
                    Change real estate agency
                  </span>
              </div>
            </div>
            :<div>
              <div
                className	= "contact-list-item"
                onClick		= { () => { FacilityActions.createPropertyManager.run( facility, this.setItem.bind(this) )  } }
                style 		= { { paddingLeft:"24px" } }
              >
              <span style = { {display:"inline-block",minWidth:"18px",paddingRight:"24px"} }>
                <i className = "fa fa-plus"></i>
              </span>
                  <span className = "active-link" style = {{ fontStyle:"italic" }} >
                    Add real estate agency
                  </span>
              </div>
            </div>
        }
        </div>
        <div className="col-sm-12">
          <div className="col-offset-sm-6">
            <div style={{paddingLeft: "10px", paddingTop: "10px", paddingBottom:"10px"}}>
              <Switch
                placeholder={"Property manager to approve all Base Building Work Orders"}
                value = { allow }
                onChange={
                  ( value ) => {
                    this.setState({
                      allow: value
                    }, () => Facilities.update( { _id: facility._id }, { $set: { allowProrertyManager: value } } ) )
                  }
                }
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
