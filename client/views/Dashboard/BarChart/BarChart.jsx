BarChart = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	var view = this.props.view;

    	var query = {};

    	switch(view) {
    		case 'today':
    			query.createdAt = {
    				$gte:moment().startOf('day').toDate()
    			}
    		break;
    		case 'this week':
    			query.createdAt = {
    				$gte:moment().startOf('week').toDate()
    			}
    		break;
    		case 'this month':
    			query.createdAt = {
    				$gte:moment().startOf('month').toDate()
    			}
    		break;
    		case 'this 3 months':
    			query.createdAt = {
    				$gte:moment().subtract(2).startOf('month').toDate()
    			}
    		break;
    		case 'this 6 months':
    			query.createdAt = {
    				$gte:moment().subtract(5).startOf('month').toDate()
    			}
    		break;
    	}


    	var facility = Session.get('selectedFacility');
    	if(facility) {
    		query["facility._id"] = facility._id;
    	}

    	var team = Session.get('selectedTeam');
    	if(team) {
    		query["team._id"] = team._id;
    	}

    	var issues = Issues.find(query);

    	var buckets = {};
    	var labels = [];
    	var counts = [];
    	issues.map(function(i){
    		var serviceName;
    		if(i.service&&i.service.name) {
    			serviceName = i.service.name;
    			if(!buckets[serviceName]) {
    				labels.push(serviceName);
    				buckets[serviceName] = [];
    			}
    			buckets[serviceName].push(i);
    		}
    	});
    	labels.map(function(serviceName,idx){
    		counts[idx] = buckets[serviceName].length;
    	});

    	return {
    		facility:Session.get('selectedFacility'),
    		labels:labels,
    		set:counts
    	}
    },

    getChartConfiguration() {
    	return {
	    	barData:{
		        labels: this.data.labels||[''],
		        datasets: [
		            {
		                fillColor: "rgba(117,170,238,0.8)",
		                strokeColor: "rgba(117,170,238,1)",
		                highlightFill: "rgba(117,170,238,0.5)",
		                highlightFill: "rgba(117,170,238,1)",
		                data: this.data.set||[0]
		            }
		        ]
		    },
		    barOptions:{
		        scaleBeginAtZero: true,
		        scaleShowGridLines: true,
		        scaleGridLineColor: "rgba(0,0,0,.05)",
		        scaleGridLineWidth: 1,
		        barShowStroke: true,
		        barStrokeWidth: 1,
		        barValueSpacing: 5,
		        barDatasetSpacing: 1,
		        responsive: true
		    }
		}

    },
	
	resetChart() {
		var config = this.getChartConfiguration();
		if(this.chart) {
			this.chart.destroy();
		}
	    var ctx = document.getElementById("bar-chart").getContext("2d");
	    this.chart = new Chart(ctx).Bar(config.barData, config.barOptions);
	},

	updateChart() {
        for(var i=0;i<this.data.set.length;i++) {
	        this.chart.datasets[0].bars[i].value = this.data.set[i];
        }
	    this.chart.scale.xLabels = this.data.labels;
        this.chart.update();
	},	

	componentDidMount() {
        this.resetChart();
	},

	componentDidUpdate() {
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
	    		<canvas id="bar-chart"></canvas>
	    	</div>
	    )
	}

});