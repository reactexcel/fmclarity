/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import Perf from 'react-addons-perf';

import {Calendar} from '/modules/ui/Calendar';
import {InboxWidget} from '/modules/models/Messages';
import {FacilityFilter} from '/modules/models/Facilities';

import ProgressOverviewChart from '../reports/ProgressOverviewChart.jsx';
import RequestActivityChart from '../reports/RequestActivityChart';
import RequestBreakdownChart from '../reports/RequestBreakdownChart.jsx';

/**
 * The main landing page for FMs which is intended to give a broad overview of job status
 * @class      PageDashboard
 * @memberOf    module:features/Reports
 */
function PageDashboard(props) {
  let canGetMessages = false;
  let {team, facilities, facility, user} = props;
  if (!team) {
    /*Perf.start();*/
    return <div/>
  }

  /*
   Perf.stop();
   Perf.printInclusive();
   */
  return (
    <div className="dashboard-page animated fadeIn">
      <FacilityFilter items={ facilities } selectedItem={ facility } />
      <div className="row" style={{paddingTop: "50px"}}>
        <div className="col-sm-6" style={{paddingRight: "0px"}}>
          <div className="ibox">
            <div className="ibox-content" style={{padding: "7px"}}>
              <Calendar team={team} facility={facility} user={user}/>
            </div>
          </div>
          <div className="ibox">
            <ReportsNavWidget />
          </div>

          { canGetMessages ?
            <div className="ibox">
              <InboxWidget/>
            </div>
            : null }

        </div>
        <div className="col-sm-6" style={{paddingRight: "0px"}}>
          <div className="ibox">
            <ProgressOverviewChart facility={facility} />
          </div>
          <div className="ibox">
            <RequestActivityChart facility={facility} team={team}
                                  minimal={ true }/>
          </div>
          <div className="ibox">
            {/*<RequestBreakdownChart minimal={ true }/>*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDashboard;
