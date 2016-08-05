import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

//todo - create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/

const Calendar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var data = {
            user:Meteor.user()
        };

        if(data.user) {
            data.team = data.user.getTeam();
            if(data.team) {
                var query = {"team._id":data.team._id};
                var facility = Session.get("selectedFacility");
                if(facility) {
                    query["facility._id"] = facility._id;
                }
                query.$or = [{status:Issues.STATUS_NEW},{status:Issues.STATUS_ISSUED},{status:"PMP"}];
                /*query.dueDate = {
                    $gte:moment().startOf('month').toDate(),
                    $lte:moment().endOf('month').toDate()
                }*/
                data.requests = data.user.getRequests(query,{expandPMP:true});
            }
        }
        return data;
    },

    addEvents() {
        if(!this.data.requests)
            return;

        var colors = {
            "Scheduled":"#70aaee",
            "Standard":"#0152b5",
            "Urgent":"#f5a623",
            "Critical":"#d0021b",
            "Closed":"#000000"
        };

        var events = this.events.events;
        events.length = 0;
        this.data.requests.map((i)=>{
            if(i.dueDate) {
                events.push({
                    title:`#${i.code} ${i.name}`,
                    color:colors[i.priority],
                    start:i.dueDate,
                    allDay:true,
                    url:i.getUrl()
                });
            }
        });
        $(this.refs.calendar).fullCalendar('removeEventSource',events);
        $(this.refs.calendar).fullCalendar('addEventSource',events);
    },

    componentDidMount() {
        this.events = {
            events:[]
        };
        $(this.refs.calendar).fullCalendar({
            //height:500,
            eventLimit:true,
            header: {
                left:'prev',
                center: 'title,today',
                right:'next'
            }
        });
        this.addEvents();
    },

    componentDidUpdate() {
        this.addEvents();
    },
  
    render() {
        return (
          <div ref="calendar"></div>
        )
    }


});

CalendarPage = React.createClass({
  render() {
    return (
        <div style={{display:"inline"}}>
            <FacilityFilter/>
            <div className="i-box" style={{backgroundColor:"#fff", padding:"15px",marginTop:"50px"}}>
                <Calendar/>
            </div>
        </div>
    )
  }
})


export { Calendar, CalendarPage }