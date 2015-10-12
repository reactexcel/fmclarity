BarChart = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	return {
    		facility:Session.get('selectedFacility')
    	}
    },

    getInitialState() {
    	return {
    		initialised:false
    	}
    },
	
	initChart() {
	    var barData = {
	        labels: ["January", "February", "March", "April", "May", "June"],
	        datasets: [
	            {
	                label: "Open",
	                fillColor: "rgba(220,220,220,0.5)",
	                strokeColor: "rgba(220,220,220,0.8)",
	                highlightFill: "rgba(220,220,220,0.75)",
	                highlightStroke: "rgba(220,220,220,1)",
	                data: [0,0,0,0,0,0]
	            },
	            {
	                label: "Closed",
	                fillColor: "rgba(26,179,148,0.5)",
	                strokeColor: "rgba(26,179,148,0.8)",
	                highlightFill: "rgba(26,179,148,0.75)",
	                highlightStroke: "rgba(26,179,148,1)",
	                data: [0,0,0,0,0,0]
	            }
	        ]
	    };

	    var barOptions = {
	        scaleBeginAtZero: true,
	        scaleShowGridLines: true,
	        scaleGridLineColor: "rgba(0,0,0,.05)",
	        scaleGridLineWidth: 1,
	        barShowStroke: true,
	        barStrokeWidth: 2,
	        barValueSpacing: 5,
	        barDatasetSpacing: 1,
	        responsive: true,
			legendTemplate : "<ul class=\"chart-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	    }

	    var ctx = document.getElementById("bar-chart").getContext("2d");
	    this.chart = new Chart(ctx).Bar(barData, barOptions);
		this.legend = this.chart.generateLegend();
  		$('#bar-chart-wrapper').append(this.legend); 

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
        var data = {
        	closed:this.createRandomSet(6,10),
        	open:this.createRandomSet(6,10)
        }
        for(var i=0;i<6;i++) {
	        this.chart.datasets[0].bars[i].value = data.closed[i];
	        this.chart.datasets[1].bars[i].value = data.open[i];
        }
        this.chart.update();
	},

	componentDidMount() {
        this.initChart();
	},


	render() {
		this.updateData();
	    return (
	    	<div id="bar-chart-wrapper">
	    		<canvas id="bar-chart"></canvas>
	    	</div>
	    )
	}

});