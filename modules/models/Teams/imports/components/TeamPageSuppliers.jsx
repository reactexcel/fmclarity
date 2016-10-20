/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";

import { NavList } from '/modules/ui/MaterialNavigation';
import { ContactCard } from '/modules/mixins/Members';

import TeamPanel from './TeamPanel.jsx';
import { FacilityFilter } from '/modules/models/Facilities';

/**
 * @class           TeamPageSuppliers
 * @memberOf        module:models/Teams
 */
class TeamPageSuppliers extends React.Component {

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
        let { team, facility, facilities, suppliers } = this.props;
        if( !team ) {
            return <div/>
        }
        return (
            <div className = "suppliers-page animated fadeIn">

                <FacilityFilter
                    items           = { facilities }
                    selectedItem    = { facility }
                    onChange = {
                      () => {
                        this.setState( {
                            supplier: null
                        } )
                      }
                    }
                />

                <div className = "row" style = { { paddingTop:"50px" } }>

                    <div className="col-md-4">

                        <NavList
                            tile            = { ContactCard }
                            items           = { suppliers }
                            selectedItem    = { this.state.supplier }
                            onClick         = { (supplier) => {
                                                this.setState( {
                                                    supplier: supplier
                                                } )
                                            } }
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

export default TeamPageSuppliers;
