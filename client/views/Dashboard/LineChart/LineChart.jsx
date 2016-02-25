LineChart = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	var openQuery = {
    	}
    	var closedQuery = {
    		status:"Closed",
    	}

    	var team = Session.get('selectedTeam');
    	if(team) {
    		openQuery["team._id"] = team._id;
    		closedQuery["team._id"] = team._id;
    	}

    	var facility = Session.get('selectedFacility');    	
    	if(facility) {
    		openQuery["facility._id"] = facility._id;
    		closedQuery["facility._id"] = facility._id;
    	}

    	var viewConfig = this.state.viewConfig;
		var open = Issues.actions.searchByDate({q:openQuery,config:viewConfig});
		var closed = Issues.actions.searchByDate({q:closedQuery,config:viewConfig});
		var labels = open.labels;
		var title = viewConfig.startDate.format(viewConfig.title);

    	return {
    		facility:facility,
    		openSeries:open.sets,
    		closedSeries:closed.sets,
    		labels:labels,
    		title:title
    	}
    },

    getInitialState() {
    	return {
			viewConfig:{
	    		format:'MMM',
	    		title:"[since] MMMM YYYY",
	    		startDate:moment().subtract(2,'months').startOf('month'),
	    		endDate:moment().endOf('month'),
   			}
    	}
    },

	getMenu() {
		var component = this;
		return [
			{
				label:("Day"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'hA',
	    				title:"dddd Do MMMM",
	    				startDate:moment().startOf('day'),
	    				endDate:moment().endOf('day'),
	    				groupBy:'hour'
	    			}});
				}
			},
			{
				label:("Week"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'ddd',
	    				title:"for [week starting] Do MMMM",
	    				startDate:moment().startOf('week'),
	    				endDate:moment().endOf('week'),
	    				groupBy:'day'
	    			}});
				}
			},
			{
				label:("Month"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'D',
	    				title:"MMMM YYYY",
	    				startDate:moment().startOf('month'),
	    				endDate:moment().endOf('month'),
	    				groupBy:'day'
	    			}});
				}
			},
			{
				label:("3 Months"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'MMM',
	    				title:"[since] MMMM YYYY",
	    				startDate:moment().subtract(2,'months').startOf('month'),
	    				endDate:moment().endOf('month'),
	    			}});
				}
			},
			{
				label:("6 Months"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'MMM',
	    				title:"[since] MMMM YYYY",
	    				startDate:moment().subtract(5,'months').startOf('month'),
	    				endDate:moment().endOf('month'),
	    			}});
				}
			},
			{
				label:("Year"),
				action(){
	    			component.setState({viewConfig:{
	    				format:'MMM',
	    				title:"YYYY",
	    				startDate:moment().startOf('year'),
	    				endDate:moment().endOf('year'),
	    				groupBy:'month',
	    			}});
				}
			}
		];
	},

    getChartConfiguration() {
    	return {
    		lineData:{
		        labels: this.data.labels||[''],
		        datasets: [
		            {
		                label: "Open",
		                fillColor: "rgba(117,170,238,0.8)",
		                strokeColor: "rgba(117,170,238,1)",
		                pointColor: "rgba(117,170,238,1)",
		                pointStrokeColor: "#fff",
		                pointHighlightFill: "#fff",
		                pointHighlightStroke: "rgba(220,220,220,1)",
		                data: this.data.openSeries||[0]
		            },
		            {
		                label: "Closed",
		                fillColor: "rgba(193,217,245,0.8)",
		                strokeColor: "rgba(193,217,245,1)",
		                pointColor: "rgba(193,217,245,1)",
		                pointStrokeColor: "#fff",
		                pointHighlightFill: "#fff",
		                pointHighlightStroke: "rgba(220,220,220,1)",
		                data: this.data.closedSeries||[0]
		            }
		        ]
		    },
	    	lineOptions:{
		        scaleShowGridLines: true,
		        scaleGridLineColor: "rgba(0,0,0,.05)",
		        scaleGridLineWidth: 1,
		        bezierCurve: true,
		        bezierCurveTension: 0.2,
		        pointDot: true,
		        pointDotRadius: 4,
		        pointDotStrokeWidth: 1,
		        pointHitDetectionRadius: 20,
		        datasetStroke: true,
		        datasetStrokeWidth: 1,
		        datasetFill: true,
		        responsive: true,
				legendTemplate : "<ul class=\"chart-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
		    }
    	}
    },


	resetChart() {
		var config = this.getChartConfiguration();
		if(this.chart) {
			this.chart.destroy();
		}
	    var ctx = document.getElementById("line-chart").getContext("2d");
	    this.chart = new Chart(ctx).Line(config.lineData, config.lineOptions);
	    if(!this.legend) {
			this.legend = this.chart.generateLegend();
	  		$('#line-chart-wrapper').append(this.legend);
	  	}
	},

	updateChart() {
        for(var i=0;i<this.data.labels.length;i++) {
	        this.chart.datasets[0].points[i].value = this.data.openSeries[i];
	        this.chart.datasets[1].points[i].value = this.data.closedSeries[i];
        }
	    this.chart.scale.xLabels = this.data.labels;
        this.chart.update();
	},

	componentDidMount() {
        this.resetChart();
	},

	componentDidUpdate(){
		if(this.chart&&this.data.labels.length==this.chart.scale.xLabels.length) {
			this.updateChart();
		}
		else {
	        this.resetChart();
	    }
	},


	render() {
	    return (
	    	<div>
		        <ActionsMenu items={this.getMenu()} icon="eye" />
		        <div className="ibox-title">
		        	<h2>Requests {this.data.title}</h2>
		        </div>
		        <div className="ibox-content">
			        <div className="row">
			        	<div className="col-sm-12">
			            	<div style={{margin:"0px 25px 30px 10px"}}>
								<div id="line-chart-wrapper">
								    <canvas id="line-chart"></canvas>
								</div>
					        </div>
				        </div>
				    </div>
				</div>
			</div>
	    )
	}

});