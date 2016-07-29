import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import ActionsMenu from 'meteor/fmc:actions-menu';

import Chart from 'chart.js';


RequestBreakdownChart = React.createClass({

    mixins: [ReactMeteorData],

    getInitialState(){
        var startDate = moment().subtract(2,'months').startOf('month');
        var title = startDate.format("[since] MMMM YYYY")
        return ({
            startDate:startDate,
            title:title
        })
    },

    getMenu() {
        var component = this;
        return [
            {
                label:("Day"),
                action(){
                    var startDate = moment().startOf('day');
                    var title = startDate.format("[on] dddd Do MMMM")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            },
            {
                label:("Week"),
                action(){
                    var startDate = moment().startOf('week');
                    var title = startDate.format("[for week starting] Do MMMM")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            },
            {
                label:("Month"),
                action(){
                    var startDate = moment().startOf('month');
                    var title = startDate.format("[for] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            },
            {
                label:("3 Months"),
                action(){
                    var startDate = moment().subtract(2,'months').startOf('month');
                    var title = startDate.format("[since] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            },
            {
                label:("6 Months"),
                action(){
                    var startDate = moment().subtract(5,'months').startOf('month');
                    var title = startDate.format("[since] MMMM YYYY")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            },
            {
                label:("Year"),
                action(){
                    var startDate = moment().startOf('year');
                    var title = startDate.format("YYYY")
                    component.setState({
                        startDate:startDate,
                        title:title
                    })
                }
            }
        ];
    },

    getMeteorData() {

        var startDate = this.state.startDate;
        var query = {
            createdAt:{
                $gte:this.state.startDate.toDate()
            }
        }

    	var facility = Session.get('selectedFacility');
    	if(facility) {
    		query["facility._id"] = facility._id;
    	}

    	var team = Session.get('selectedTeam');
        //var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
    	if(team) {
    		query["team._id"] = team._id;
    	}

    	var issues = Issues.find(query);

    	var buckets = {};
        var costs = {};
    	var labels = [];
    	var counts = [];
        var set = [];
    	issues.map(function(i){
    		var serviceName;
    		if(i.service&&i.service.name) {
    			serviceName = i.service.name;
                if(serviceName.length>15) {
                    serviceName = serviceName.substring(0,13)+'...';
                }
                if(!costs[serviceName]) {
                    costs[serviceName] = 0;
                }
    			if(!buckets[serviceName]) {
    				labels.push(serviceName);
    				buckets[serviceName] = [];
    			}
    			buckets[serviceName].push(i);
                var newCost = parseInt(i.costThreshold);
                if(_.isNaN(newCost)) {
                    newCost = 0;
                }
                costs[serviceName] += newCost;
    		}
    	});
    	labels.map(function(serviceName,idx){
    		counts[idx] = buckets[serviceName].length;
            set[idx] = costs[serviceName];
    	});

    	return {
    		facility:facility,
    		labels:labels,
    		set:set//costs//counts
    	}
    },

    getChartConfiguration() {
        //console.log(this.data);
    	return {
	    	barData:{
		        labels: this.data.labels||[''],
		        datasets: [
		            {
		                backgroundColor: "rgba(117,170,238,0.8)",
		                borderColor: "rgba(117,170,238,1)",
		                hoverBackgroundColor: "rgba(117,170,238,0.5)",
		                hoverBorderColor: "rgba(117,170,238,1)",
		                data: this.data.set||[0]
		            }
		        ]
		    },
		    barOptions:{
                scales:{
                    xAxes:[{
                        gridLines:{
                            //offsetGridLines:false,
                        },
                        ticks:{
                            //fontSize:10,
                            autoSkip:false,
                        }
                    }],
                    yAxes:[{
                        ticks:{
                            beginAtZero:true
                        }
                    }]
                },
                legend:{
                    display:false
                }
                /*                
		        scaleBeginAtZero: true,
		        scaleShowGridLines: true,
		        scaleGridLineColor: "rgba(0,0,0,.05)",
		        scaleGridLineWidth: 1,
		        barShowStroke: true,
		        barStrokeWidth: 1,
		        barValueSpacing: 5,
		        barDatasetSpacing: 1,
		        responsive: true
                */
		    }
		}

    },
	
	resetChart() {
		var config = this.getChartConfiguration();
		if(this.chart) {
			this.chart.destroy();
		}
	    var ctx = document.getElementById("bar-chart").getContext("2d");
	    this.chart = new Chart(ctx,{
            type:'bar',
            data:config.barData,
            options:config.barOptions
        });
	},

	updateChart() {
        //console.log(this.data.set);
        //console.log(this.chart.data);
        //for(var i=0;i<this.data.set.length;i++) {
	        this.chart.data.datasets[0].data = this.data.set;
        //}
        this.chart.data.labels = this.data.labels;
	    //this.chart.scale.xLabels = this.data.labels;
        this.chart.update();
        //this.chart.reDraw();
	},	

	componentDidMount() {
        this.resetChart();
	},

	componentDidUpdate() {
        // ???
		//if(this.chart&&this.data.labels.length==this.chart.scale.xLabels.length) {
			this.updateChart();
		//}
		//else {
	        //this.resetChart();
	    //}
	},

	render() {
	    return (
            <div>
                <ActionsMenu items={this.getMenu()} icon="eye" />
                <div className="ibox-title">
                    <h2>Request breakdown {this.state.title}</h2>
                </div>
                <div className="ibox-content">
                    <div>
                        <canvas id="bar-chart"></canvas>
                    </div>
                </div>
            </div>
	    )
	}

});

Reports.register({
    id:"request-breakdown-chart",
    name:"Request Breakdown Chart",
    content:RequestBreakdownChart
})