/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { FacilityFilter } from '/modules/models/Facilities';
import Calendar from './Calendar.jsx';

/**
 * @class           PageCalendar
 * @memberOf        module:ui/Calendar
 */
function PageCalendar( props ) {
    let { team, facility, facilities } = props;
    if ( !team ) {
        return <div/>
    }
    return (
        <div className = "animated fadeIn">
            <FacilityFilter items = { facilities } selectedItem = { facility } />
            <div style={{paddingTop:"50px 15px 15px 15px"}}>
                <div className="card-body ibox">
                    <Calendar/>
                </div>
            </div>
        </div>
    )
}

export default PageCalendar;
