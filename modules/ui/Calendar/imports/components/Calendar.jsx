/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import {RequestActions} from '/modules/models/Requests';
import Requests from '/modules/models/Requests/imports/Requests';
import moment from 'moment';

/**
 * An ui component that renders a calendar with requests appearing as events.
 * @class           Calendar
 * @memberOf        module:ui/Calendar
 * @param           {object} props
 * @param           {string} props.example
 * @todo            Create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/

 */

class Calendar extends React.Component {
  eventt = [];
  statusFilter = {"status": {$nin: ["Cancelled", "Deleted", "Closed", "Reversed"]}};
  contextFilter = {};
  calendar = {};

  constructor(props) {
    super(props);

    this.state = {
      requests: [],
      monthFilter: {
        start: moment().startOf('month').toDate(),
        end: moment().startOf('month').toDate()
      },
      facility: null,
      team: null
    };
  };

  componentWillReceiveProps(props) {

    this.setState({
      user: props.user,
      facility: props.facility,
      team: props.team
    }, () => {
      this.contextFilter = {};
      if (this.state.facility && this.state.facility._id) {
        this.contextFilter['facility._id'] = this.state.facility._id;
      } else if (this.state.team && this.state.team._id) {
        this.contextFilter['team._id'] = this.state.team._id;
      }

      this.setState({
        requests: this.getRequests()
      }, () => {
        this._addEvents(this.state);
        this.calendar.fullCalendar('refetchEvents');
      });
    });

  }

  getRequests() {

    let { requests } = Requests.findForUser(
      this.props.user,
      {$and: [this.statusFilter, this.contextFilter]},
      {expandPMP: true},
      {start: this.state.monthFilter.start, end: this.state.monthFilter.end}
    );

    return requests;
  }


  /**
   * Add events when component mounts
   * @memberOf    module:ui/Calendar.Calendar
   */
  componentDidMount = () => {
    this.events = {
      events: []
    };
    let self = this;

    this.calendar = $('#calendar');

    this.calendar.fullCalendar({
      eventClick(event) {
        if (event.request) {
          RequestActions.view.run(event.request, () => {});
        }
      },
      displayEventTime: false,
      eventLimit: true,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      defaultView: 'month',
      eventMouseover: function (data, event, view) {
        $("body").append('<div class="calendar-tooltip">PRIORITY :<b>' + data.tooltip + '</b></div>');
        let tooltip = $('.calendar-tooltip');
        $(this).mouseover(function (e) {
          $(this).css('z-index', 10000);
          tooltip.fadeIn('500').fadeTo('10', 1.9);
        }).mousemove(function (e) {
          tooltip.css('top', e.pageY + 10).css('left', e.pageX + 20);
        });
      },
      eventMouseout: function (data, event, view) {
        $(this).css('z-index', 0);
        $('.calendar-tooltip').remove();
      },
      event: function(start, end, timezone, callback) {
        let startOfMonth = start.startOf('month').toDate();
        let endOfMonth = end.endOf('month').toDate();
        if (!moment(startOfMonth).isSame(self.state.monthFilter.start) ||
          !moment(endOfMonth).isSame(self.state.monthFilter.end)) {
          self.setState({
            monthFilter: {
              start: startOfMonth,
              end: endOfMonth
            }
          });
          self.setState({
            requests: self.getRequests()
          }, () => {
            callback(self._addEvents(self.state, true));
          });
        }
      },
      viewRender: function (view) {
        //let event = $("#calendar").fullCalendar('clientEvents');
        let event = self.eventt;
        if (event && event.length > 0) {
          event.map((evt, id) => {
            event[id].allDay = !(view.name == "agendaWeek" || view.name == "agendaDay");
          });
          self.eventt = event;
          self._addEvents(self.state);
          self.calendar.fullCalendar('refetchEvents');
        }
      },
      eventRender: function (event, element) {
        setTimeout(function () {
          $('.fc-popover').css('max-height', '360px');
          $('.fc-popover').css('overflow', 'auto');
          let position = $('.fc-popover').position()
          if (position) {
            if (position.top < 0) {
              $('.fc-popover').css('top', '0px');
            }
            if (position.left > 300) {
              $('.fc-popover').css('left', '300px');
            }
          }
        }, 10);
      }
    });
    this._addEvents(this.state);
  };

  /**
   * Takes the retrieved data and adds events to the calendar
   * @memberOf    module:ui/Calendar.Calendar
   * @private
   */
  _addEvents({requests}, returnData = false) {
    let calendarView = this.calendar.fullCalendar('getView');
    let allDays = !_.contains(['agendaWeek', 'agendaDay'], calendarView.name);

    if (!requests) {
      return;
    }

    let colors = {
      "Scheduled": "#70aaee",
      "Standard": "#0152b5",
      "Urgent": "#f5a623",
      "Critical": "#d0021b",
      "Close": "#000000",
      "Booking": "#ef6c00",
      "PPM": "#333333",
    };

    let events = this.events.events;
    events.length = 0;

    requests.map((request) => {
      if (request.type === "Booking" && request.bookingPeriod && request.bookingPeriod.startTime && request.bookingPeriod.endTime) {
        let title = null;
        if (request.code) {
          title = `#${request.code} ${request.name}`
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
          if (request.type === 'Scheduler') {
            title = request.name;
          } else if (request.code) {
            title = `#${request.code} ${request.name}`
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

    if (returnData) {
      return events;
    }

    this.eventt = events;
    this.calendar.fullCalendar('removeEventSource', events);
    this.calendar.fullCalendar('addEventSource', events);
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
      <div ref="calendar" id="calendar"/>
    )
  }
}

export default Calendar;
