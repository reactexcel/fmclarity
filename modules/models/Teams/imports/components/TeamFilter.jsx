/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { NavListDropDown } from '/modules/ui/MaterialNavigation';
import { ContactCard } from '/modules/mixins/Members';

/**
 * @class           TeamFilter
 * @memberOf        module:models/Teams
 */
function TeamFilter( props ) {
    return (
        <div style = { { overflow: "hidden" }}>
        <NavListDropDown
            { ...props }
            ListTile = { ContactCard }
            startOpen = { false }
            onChange = { ( team ) => { 
                Session.selectTeam( team );
            } }
            multiple = { true }
        />
        </div>
    )
}

export default TeamFilter;