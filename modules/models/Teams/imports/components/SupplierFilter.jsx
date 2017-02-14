import React from 'react';
import { Teams, TeamStepper } from '/modules/models/Teams';
import { ContactCard } from '/modules/mixins/Members';

export default class SupplierFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamsFound: false,
            teamType: this.props.teamType || null
        }
    }
    checkName( event ) {
        event.preventDefault();
        var inputName = this.refs.invitation.value;
        let query = {
            name: {
                $regex: inputName,
                $options: 'i'
            }
        };
        if ( this.state.teamType ) {
            query.type = this.state.teamType
        }
        suppliers = inputName?Teams.findAll( query, { sort: { name: 1 } } ):null;
        if( this.props.onChange) this.props.onChange( suppliers );
    }
    render() {
        return (
            <div className="row" style={{marginLeft:"0px"}}>
                <div className="col-lg-12" style={{backgroundColor:"#FFFFFF",borderBottom:"1px solid #e3e3e3" }}>
                    <form style={{padding:"15px"}} className="form-inline">
                        <div className="form-group">
                            <b>Lets search to see if this team already has an account.</b>
                            <h2><input className="inline-form-control" ref="invitation" placeholder="Team name"/></h2>
                            <button type = "submit" style = { { width:0, opacity:0} } onClick = { this.checkName.bind(this) }>Invite</button>
                        </div>
                    </form>
                </div>
            </div>
        );
      }
}
