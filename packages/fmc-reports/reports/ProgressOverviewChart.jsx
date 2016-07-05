import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

ProgressOverviewChart = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

        var baseQuery = {};
        var queries = {
            New:{},
            Issued:{},
            Closed:{},
        };

        var facility = Session.get('selectedFacility');     
        if(facility) {
            baseQuery["facility._id"] = facility._id;
        }

        var team = Session.get('selectedTeam');
        //var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
        if(team) {
            baseQuery["team._id"] = team._id;
        
            var period = this.state.period;
            var startDate = this.state.startDate;
            var endDate = this.state.endDate;
            var lastStartDate = startDate.clone().subtract(period.number,period.unit+'s');
            var lastEndDate = endDate.clone().subtract(period.number,period.unit+'s');

            for(var status in queries) {
                var qThisMonth = _.extend({},baseQuery,{
                    status:status,
                    createdAt:{
                        $gte:startDate.toDate(),
                        $lte:endDate.toDate()
                    }
                });
                var qLastMonth = _.extend({},baseQuery,{
                    status:status,
                    createdAt:{
                        $gte:lastStartDate.toDate(),
                        $lte:lastEndDate.toDate()
                    }
                });
                queries[status].thisPeriod = Issues.find(qThisMonth).count();
                queries[status].lastPeriod = Issues.find(qLastMonth).count();
            }
        }

        return {
            results:queries
        }
    },

    getInitialState(){
        var startDate = moment().subtract(2,'months').startOf('month');
        var title = startDate.format("[since] MMMM YYYY")
        return ({
            startDate:startDate,
            endDate:moment().endOf('month'),
            title:title,
            period:{number:3,unit:'month'}
        })
    },

    getMenu() {
        var component = this;
        return [
            {
                label:("Day"),
                action(){
                    var startDate = moment().startOf('day');
                    var endDate = moment().endOf('day');
                    var title = startDate.format("[for] dddd Do MMMM")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:1,unit:'day'}
                    })
                }
            },
            {
                label:("Week"),
                action(){
                    var startDate = moment().startOf('week');
                    var endDate = moment().endOf('week');
                    var title = startDate.format("[for week starting] Do MMMM")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:1,unit:'week'}
                    })
                }
            },
            {
                label:("Month"),
                action(){
                    var startDate = moment().startOf('month');
                    var endDate = moment().endOf('month');
                    var title = startDate.format("[for] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:1,unit:'month'}
                    })
                }
            },
            {
                label:("3 Months"),
                action(){
                    var startDate = moment().subtract(2,'months').startOf('month');
                    var endDate = moment().endOf('month');
                    var title = startDate.format("[for 3 months since] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:3,unit:'month'}
                    })
                }
            },
            {
                label:("6 Months"),
                action(){
                    var startDate = moment().subtract(5,'months').startOf('month');
                    var endDate = moment().endOf('month');
                    var title = startDate.format("[for 6 months since] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:6,unit:'month'}
                    })
                }
            },
            {
                label:("Year"),
                action(){
                    var startDate = moment().startOf('year');
                    var endDate = moment().endOf('year');
                    var title = startDate.format("[for] YYYY")
                    component.setState({
                        startDate:startDate,
                        endDate:endDate,
                        title:title,
                        period:{number:1,unit:'year'}
                    })
                }
            }
        ];
    },    

    render() {
        var results = this.data.results;
        return (
            <div>
                <ActionsMenu items={this.getMenu()} icon="eye" />
                <div className="ibox-title">
                    <h2>Overview {this.state.title}</h2>
                </div>
                <div className="ibox-content" style={{padding:"0px 50px 30px 50px"}}>
                    <div className="row" style={{textAlign:"center",clear:"both"}}>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="New Requests" 
                                thisPeriod = {results['New'].thisPeriod}
                                lastPeriod = {results['New'].lastPeriod}
                                color="#3ca773"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Issued Requests" 
                                thisPeriod = {results['Issued'].thisPeriod}
                                lastPeriod = {results['Issued'].lastPeriod}
                                color="#b8e986"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Closed Requests" 
                                thisPeriod = {results['Closed'].thisPeriod}
                                lastPeriod = {results['Closed'].lastPeriod}
                                color="#333333"
                            />
                        </div>
                        {/*
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Open Quotes" 
                                thisPeriod = {4}
                                lastPeriod = {3}
                                color="#999999"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Expired Insurance" 
                                thisPeriod = {5}
                                lastPeriod = {0}
                                color="#666666"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Supplier Reviews" 
                                thisPeriod = {10}
                                lastPeriod = {11}
                                color="#333333"
                            />
                        </div>
                        */}
                    </div>
                </div>
            </div>
        )
    }
})
/*
Reports.register({
    id:"requests-overview-chart",
    name:"Requests Overview Chart",
    content:ProgressOverviewChart
})
*/


