Calendar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var team,issues;
        team = Session.get("selectedTeam");
        if(team) {
            var query = {"team._id":team._id};
            var facility = Session.get("selectedFacility");
            if(facility) {
                query["facility._id"] = facility._id;
            }
            query.$or = [{status:Issues.STATUS_NEW},{status:Issues.STATUS_ISSUED}];
            query.createdAt = {
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

        var events = this.events.events;
        events.length = 0;
        this.data.issues.map(function(i){
            if(i.dueDate) {
                events.push({
                    title:"#"+i.code+" due",
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