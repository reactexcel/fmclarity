import React from "react";

import { NavListDropDown } from '/modules/ui/MaterialNavigation';
import { ContactCard } from '/modules/mixins/Members';

export default function TeamFilter( props ) {
    return (
        <div style = { { overflow: "hidden" }}>
        <NavListDropDown
            { ...props }
            tile = { ContactCard }
            startOpen = { false }
            onChange = { ( team ) => { 
                Session.selectTeam( team );
            } }
            multiple = { true }
        />
        </div>
    )
}
