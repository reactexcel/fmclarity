import React from "react";

import { NavListDropDown } from '/both/modules/MaterialNavigation';
import FacilityListTile from './FacilityListTile.jsx';

export default function FacilityFilter( props ) {

    let { team, facility } = props;

    if ( !team ) {
        return <div/>
    }

    return (
        <div style={{position:"absolute",zIndex:1300}}>
            <NavListDropDown
                items = { props.team.facilities } 
                selectedItem = { props.facility }
                tile = { FacilityListTile }
                startOpen = { false }
                onChange = { ( facility ) => { 
                    Session.set( "selectedFacility", facility );
                } }
                multiple = { true }
            />
        </div>
    )
}
