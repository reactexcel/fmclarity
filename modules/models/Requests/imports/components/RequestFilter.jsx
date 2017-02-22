/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React, { Component, PropTypes } from 'react';

import { NavListDropDown } from '/modules/ui/MaterialNavigation';

import { Select } from '/modules/ui/MaterialInputs';


export default function RequestFilter( { items, selectedItem, onChange } ) {
    return (
        <div style = { { position:"relative", zIndex:1300 } }>
            <h5 style= { { margin:"0px 0px 0px 0px"} }>Request filter</h5>
            <Select
                value       = { selectedItem }
                items       = { items }
                onChange    = 
                    { ( item ) => {
                        Session.set( 'selectedStatus', item );
                    } }
            />
        </div>
    )
}
