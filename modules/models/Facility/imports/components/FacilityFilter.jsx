import React from "react";

import { NavListDropDown } from '/modules/ui/MaterialNavigation';
import FacilityListTile from './FacilityListTile.jsx';

export default function FacilityFilter( props ) {
    //<div style={{position:"absolute",zIndex:1300}}>
    return (
        <div style = { { overflow: "hidden" }}>
        <NavListDropDown
            { ...props }
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
