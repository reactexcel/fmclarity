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
	        labels: ["Mechanical", "Fire Protection", "Electrical", "Water Treatment", "Lifts", "Generator"],
	        datasets: [
	            {
	                label: "Compliant",
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
	        responsive: true
	    }

	    var ctx = document.getElementById("bar-chart").getContext("2d");
	    this.chart = new Chart(ctx).Bar(barData, barOptions);

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
        var data = this.createRandomSet(6,9);
        for(var i=0;i<6;i++) {
	        this.chart.datasets[0].bars[i].value = data[i];
        }
        this.chart.update();
	},

	componentDidMount() {
        this.initChart();
	},


	render() {
		this.updateData();
	    return (
	    	<div>
	    		<canvas id="bar-chart"></canvas>
	    	</div>
	    )
	}

});