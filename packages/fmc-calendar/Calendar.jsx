import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

const Calendar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var team,issues;
        team = Session.get("selectedTeam");
        //team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
        if(team) {
            var query = {"team._id":team._id};
            var facility = Session.get("selectedFacility");
            if(facility) {
                query["facility._id"] = facility._id;
            }
            query.$or = [{status:Issues.STATUS_NEW},{status:Issues.STATUS_ISSUED},{status:"PMP"}];
            query.dueDate = {
                $gte:moment().startOf('month').toDate(),
                $lte:moment().endOf('month').toDate()
            }
            issues = Issues.find(query).fetch();
        }
        return {
            team:team,
            issues:issues
        }
    },

    addEvents() {
        if(!this.data.issues)
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
        this.data.issues.map(function(i){
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
                left:'',
                center: 'title',
                right:''
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
    return <div className="i-box" style={{backgroundColor:"#fff",margin:"20px",padding:"20px",position:"relative",top:"20px"}}><Calendar/></div>
  }
})


export { Calendar, CalendarPage }