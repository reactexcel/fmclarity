/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import PropTypes from "prop-types";
import { RequestActions } from "/modules/models/Requests";
import moment from "moment";

import LoaderSmall from "/modules/ui/Loader/imports/components/LoaderSmall";

/**
 * An ui component that renders a calendar with requests appearing as events.
 * @class           Calendar
 * @memberOf        module:ui/Calendar
 * @param           {object} props
 * @param           {string} props.example
 */

export default class Calendar extends React.Component {
  eventt = [];
  calendar = {};
  mounted = false;

  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      facility: props.facility,
      team: props.team,
      requests: [],
      monthFilter: {
        start: moment()
          .startOf("month")
          .toDate(),
        end: moment()
          .endOf("month")
          .toDate()
      }
    };

    Session.set('calendar-config', null);
  }

  componentWillReceiveProps(props) {
    if (props.requests) {
      this.setState({ requests: props.requests }, () => {
        this._addEvents(this.state);
        this.calendar.fullCalendar("refetchEvents");
      });
    }
  }

  getRequests = () => {
    let config = {
      monthFilter: {
        start: this.state.monthFilter.start,
        end: this.state.monthFilter.end
      }
    };
    Session.set('calendar-config', config);
  };

  /**
   * Add events when component mounts
   * @memberOf    module:ui/Calendar.Calendar
   */
  componentDidMount = () => {
    this.getRequests();
    this.events = {
      events: []
    };
    let self = this;

    this.calendar = $("#calendar");

    this.calendar.fullCalendar({
      eventClick(event) {
        if (event.request) {
          RequestActions.view.run(event.request, () => {});
        }
      },
      displayEventTime: false,
      eventLimit: true,
      header: {
        left: "prev,next today",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      defaultView: "month",
      eventMouseover: function(data, event, view) {
        $("body").append(
          '<div class="calendar-tooltip">PRIORITY :<b>' +
            data.tooltip +
            "</b></div>"
        );
        let tooltip = $(".calendar-tooltip");
        $(this)
          .mouseover(function(e) {
            $(this).css("z-index", 10000);
            tooltip.fadeIn("500").fadeTo("10", 1.9);
          })
          .mousemove(function(e) {
            tooltip.css("top", e.pageY + 10).css("left", e.pageX + 20);
          });
      },
      eventMouseout: function(data, event, view) {
        $(this).css("z-index", 0);
        $(".calendar-tooltip").remove();
      },
      viewRender: function(view) {
        //let event = $("#calendar").fullCalendar('clientEvents');
        let startOfMonth = self.calendar
          .fullCalendar("getDate")
          .startOf("month")
          .toDate();
        let endOfMonth = self.calendar
          .fullCalendar("getDate")
          .endOf("month")
          .toDate();
        //
        if (
          !moment(startOfMonth).isSame(self.state.monthFilter.start) ||
          !moment(endOfMonth).isSame(self.state.monthFilter.end)
        ) {
          self.setState(
            {
              monthFilter: {
                start: startOfMonth,
                end: endOfMonth
              }
            },
            () => {
              self.getRequests();
            }
          );
        } else {
          let event = self.eventt;
          if (event && event.length > 0) {
            event.map((evt, id) => {
              event[id].allDay = !(
                view.name == "agendaWeek" || view.name == "agendaDay"
              );
            });
            self.eventt = event;
            self._addEvents(self.state);
            self.calendar.fullCalendar("refetchEvents");
          }
        }
      },
      eventRender: function(event, element) {
        setTimeout(function() {
          $(".fc-popover").css("max-height", "360px");
          $(".fc-popover").css("overflow", "auto");
          let position = $(".fc-popover").position();
          if (position) {
            if (position.top < 0) {
              $(".fc-popover").css("top", "0px");
            }
            if (position.left > 300) {
              $(".fc-popover").css("left", "300px");
            }
          }
        }, 10);
      }
    });

    this._addEvents(this.state);
    self.calendar.fullCalendar("refetchEvents");
  };

  /**
   * Takes the retrieved data and adds events to the calendar
   * @memberOf    module:ui/Calendar.Calendar
   * @private
   */
  _addEvents({ requests }, returnData = false) {
    let calendarView = this.calendar.fullCalendar("getView");
    let allDays = !_.contains(["agendaWeek", "agendaDay"], calendarView.name);

    if (!requests) {
      return;
    }

    let colors = {
      Scheduled: "#70aaee",
      Standard: "#0152b5",
      Urgent: "#f5a623",
      Critical: "#d0021b",
      Close: "#000000",
      Booking: "#ef6c00",
      PPM: "#333333"
    };

    let events = this.events.events;
    events.length = 0;

    requests.map(request => {
      if (
        request.type === "Booking" &&
        request.bookingPeriod &&
        request.bookingPeriod.startTime &&
        request.bookingPeriod.endTime
      ) {
        let title = null;
        if (request.code) {
          title = `#${request.code} ${request.name}`;
        } else {
          title = request.name;
        }
        events.push({
          title: title,
          color: colors[request.priority],
          start: request.bookingPeriod.startTime,
          end: request.bookingPeriod.endTime,
          allDay: allDays,
          request: {
            _id: request._id,
            code: request.code,
            name: request.name,
            start: request.dueDate
          },
          tooltip: request.priority
        });
      } else {
        if (request.dueDate) {
          let title = null;
          if (request.type === "Scheduler") {
            title = request.name;
          } else if (request.code) {
            title = `#${request.code} ${request.name}`;
          } else {
            title = request.name;
          }
          events.push({
            title: title,
            color: colors[request.priority],
            start: request.dueDate,
            allDay: allDays,
            request: {
              _id: request._id,
              code: request.code,
              name: request.name
            },
            tooltip: request.priority
            //url:i.getUrl()
          });
        }
      }
    });

    this.eventt = events;
    this.calendar.fullCalendar("removeEventSource", events);
    this.calendar.fullCalendar("addEventSource", events);
  }

  /**
   * Add events when component updates
   * @memberOf    module:ui/Calendar.Calendar
   */
  componentDidUpdate() {
    this._addEvents(this.state);
  }

  /**
   * Render the component
   * @memberOf    module:ui/Calendar.Calendar
   */
  render() {
    return (
      <div ref="calendar" id="calendar" />
    );
  }
}

Calendar.propTypes = {
  team: PropTypes.object.isRequired,
  facility: PropTypes.object,
  user: PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired
};
