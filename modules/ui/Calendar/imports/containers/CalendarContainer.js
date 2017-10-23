import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import Calendar from "../components/Calendar";
import Requests from "/modules/models/Requests/imports/Requests";

export default (CalendarContainer = withTracker(
  ({ user, facility, team }) => {
    let req = requests || [];
      
    let statusFilter = {
      status: { $nin: ["Cancelled", "Deleted", "Closed", "Reversed"] }
    };

    let calendarConfig = Session.get("calendar-config");

    let defaultDateRange = {
      start: moment().startOf("month").toDate(),
      end: moment().endOf("month").toDate()
    }

    let contextFilter = {};

    if (facility && facility._id) {
      contextFilter["facility._id"] = facility._id;
    }
    if (team && team._id) {
      contextFilter["team._id"] = team._id;
    }

    let startDate = calendarConfig ? calendarConfig.monthFilter.start : defaultDateRange.start
    let endDate = calendarConfig ? calendarConfig.monthFilter.end : defaultDateRange.end

    let opts = [
      { $and: [statusFilter, contextFilter] },
      { expandPMP: true, team: team },
      { start: startDate, end: endDate }
    ];

    let { requests } = Requests.findForUser(user, ...opts);
    req = requests;

    return {
      user,
      team,
      facility,
      requests: req
    };
  }
)(Calendar));
