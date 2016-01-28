LineChart = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	return {
    		facility:Session.get('selectedFacility'),
    		openSeries:[0,0,0,0,0,Issues.actions.count({status:{$nin:["Closed"]},month:1})],
    		closedSeries:[0,0,0,0,0,Issues.actions.count({status:"Closed",month:1})],
    	}
    },

    getInitialState() {
    	return {
    		initialised:false
    	}
    },
	

	initChart() {
	    var lineData = {
	        labels: ["August", "September", "October", "November", "December", "January"],
	        datasets: [
	            {
	                label: "Open",
	                fillColor: "rgba(220,220,220,0.5)",
	                strokeColor: "rgba(220,220,220,1)",
	                pointColor: "rgba(220,220,220,1)",
	                pointStrokeColor: "#fff",
	                pointHighlightFill: "#fff",
	                pointHighlightStroke: "rgba(220,220,220,1)",
	                data: [0,0,0,0,0,0]
	            },
	            {
	                label: "Closed",
	                fillColor: "rgba(26,179,148,0.5)",
	                strokeColor: "rgba(26,179,148,0.7)",
	                pointColor: "rgba(26,179,148,1)",
	                pointStrokeColor: "#fff",
	                pointHighlightFill: "#fff",
	                pointHighlightStroke: "rgba(26,179,148,1)",
	                data: [0,0,0,0,0,0]
	            }
	        ]
	    };

	    var lineOptions = {
	        scaleShowGridLines: true,
	        scaleGridLineColor: "rgba(0,0,0,.05)",
	        scaleGridLineWidth: 1,
	        bezierCurve: false,
	        bezierCurveTension: 0.4,
	        pointDot: true,
	        pointDotRadius: 4,
	        pointDotStrokeWidth: 1,
	        pointHitDetectionRadius: 20,
	        datasetStroke: true,
	        datasetStrokeWidth: 2,
	        datasetFill: true,
	        responsive: true,
			legendTemplate : "<ul class=\"chart-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	    };

	    var ctx = document.getElementById("line-chart").getContext("2d");
	    this.chart = new Chart(ctx).Line(lineData, lineOptions);
		this.legend = this.chart.generateLegend();
  		$('#line-chart-wrapper').append(this.legend); 

  		this.setState({
  			initialised:true
  		});
	},

	createRandomSet(length,max) {
		var set = [];
		for(var i=0;i<length;i++) {
			set.push(Math.floor(Math.random()*max));
		}
		return set;
	},

	updateData() {
		if(!this.state.initialised)
			return;
        for(var i=0;i<6;i++) {
	        this.chart.datasets[0].points[i].value = this.data.closedSeries[i];
	        this.chart.datasets[1].points[i].value = this.data.openSeries[i];
        }
        this.chart.update();
	},

	componentDidMount() {
        this.initChart();
	},


	render() {
		this.updateData();
	    return (
	    	<div id="line-chart-wrapper">
	    		<canvas id="line-chart"></canvas>
	    	</div>
	    )
	}

});