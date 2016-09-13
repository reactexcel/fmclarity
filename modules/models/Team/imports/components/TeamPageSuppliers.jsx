import React from "react";

import { NavList } from '/both/modules/MaterialNavigation';
import { ContactCard } from '/both/modules/DocMembers';

import TeamPanel from './TeamPanel.jsx';
import { FacilityFilter } from '/modules/models/Facility';

export default class TeamPageSuppliers extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            supplier: null
        }
    }

    showModal( callback ) {
        Modal.show( {
            content: <TeamViewEdit facility = { this.props.facility } onChange = { callback } />
        } )
    }

    render() {
        return (
            <div className="suppliers-page animated fadeIn">
                <FacilityFilter team = { this.props.team } facility = { this.props.facility } />
                <div className="row" style={{paddingTop:"50px"}}>
                    <div className="col-md-4">
                        <NavList 

                            tile            = { ContactCard }
                            items           = { this.props.suppliers } 
                            selectedItem    = { this.state.supplier }

                            onClick = { (supplier) => {
                                this.setState({
                                    supplier: supplier
                                })
                            }}

                        />
                    </div>
                    <div className="col-md-8"> 
                        <div className="card-body ibox">
                            { this.state.supplier ?
                            <TeamPanel item = { this.state.supplier }/>
                            :null }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
