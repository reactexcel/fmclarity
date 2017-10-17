import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import Calendar from "./Calendar";
import Requests from "/modules/models/Requests/imports/Requests";

export default (CalendarContainer = withTracker(
  ({ user, facility, team, requests }) => {
    req = requests || [];

    let calendarConfig = Session.get("calendar-config");

    if (calendarConfig && user) {
      let contextFilter = {};

      if (calendarConfig.facility && calendarConfig.facility._id) {
        contextFilter["facility._id"] = config.facility._id;
      }
      if (calendarConfig.team && calendarConfig.team._id) {
        contextFilter["team._id"] = calendarConfig.team._id;
      }

      let opts = [
        { $and: [calendarConfig.statusFilter, contextFilter] },
        { expandPMP: true, team: calendarConfig.team },
        { start: calendarConfig.monthFilter.start, end: calendarConfig.monthFilter.end }
      ];

      let { requests } = Requests.findForUser(user, ...opts);
      req = requests;
    }

    return {
      user,
      team,
      facility,
      requests: req
    };
  }
)(Calendar));
