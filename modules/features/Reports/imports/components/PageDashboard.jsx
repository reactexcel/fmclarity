/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import Perf from "react-addons-perf";

import { CalendarContainer } from "/modules/ui/Calendar";
import { InboxWidget } from "/modules/models/Messages";
import { FacilityFilter } from "/modules/models/Facilities";

import ProgressOverviewChartContainer from "../containers/ProgressOverviewChartContainer";
import RequestActivityChart from "../reports/RequestActivityChart";
import ReportsNavWidget from "../reports/ReportsNavWidget";
import RequestBreakdownChartContainer from "../containers/RequestBreakdownChartContainer";
import RequestActivityChartContainer from "../containers/RequestActivityChartContainer";

/**
 * The main landing page for FMs which is intended to give a broad overview of job status
 * @class      PageDashboard
 * @memberOf    module:features/Reports
 */
function PageDashboard(props) {
  let canGetMessages = false;
  let { team, facilities, facility, user, thumbsReady } = props;

  if (!team) {
    return null;
  }
  
  return (
    <div className="dashboard-page animated fadeIn">
      {thumbsReady ? <FacilityFilter items={facilities} selectedItem={facility} />: null}
      <div className="row" style={{ paddingTop: "50px" }}>
        <div className="col-sm-6" style={{ paddingRight: "0px" }}>
          <div className="ibox">
            <div className="ibox-content" style={{ padding: "7px" }}>
              <CalendarContainer team={team} facility={facility} user={user} />
            </div>
          </div>
          <div className="ibox">
            <ReportsNavWidget />
          </div>

          {canGetMessages ? (
            <div className="ibox">
              <InboxWidget />
            </div>
          ) : null}
        </div>
        <div className="col-sm-6" style={{ paddingRight: "0px" }}>
          <div className="ibox">
            <ProgressOverviewChartContainer facility={facility} team={team} />
          </div>
          <div className="ibox">
            <RequestActivityChartContainer
              facility={facility}
              facilities={facilities}
              team={team}
              minimal={true}
            />
          </div>
          <div className="ibox">
            <RequestBreakdownChartContainer
              facility={facility}
              facilities={facilities}
              team={team}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDashboard;
