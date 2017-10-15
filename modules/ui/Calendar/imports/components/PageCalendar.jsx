/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import {FacilityFilter} from '/modules/models/Facilities';
import Calendar from './Calendar.jsx';

/**
 * @class           PageCalendar
 * @memberOf        module:ui/Calendar
 */
function PageCalendar(props) {
  let {team, facility, facilities, user} = props;
  if (!team) {
    return <div/>
  }

  return (
    <div className="animated fadeIn">
      <FacilityFilter items={ facilities } selectedItem={ facility }/>
      <div style={ {paddingTop: "50px"} }>
        <div className="card-body ibox" style={ {padding: "10px"} }>
          <Calendar team={team} facility={facility} user={user}/>
        </div>
      </div>
    </div>
  )
}

export default PageCalendar;
