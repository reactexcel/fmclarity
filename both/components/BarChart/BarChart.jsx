BarChart = React.createClass({

	initChart() {
	    var barData = {
	        labels: ["January", "February", "March", "April", "May", "June", "July"],
	        datasets: [
	            {
	                label: "My First dataset",
	                fillColor: "rgba(220,220,220,0.5)",
	                strokeColor: "rgba(220,220,220,0.8)",
	                highlightFill: "rgba(220,220,220,0.75)",
	                highlightStroke: "rgba(220,220,220,1)",
	                data: [65, 59, 80, 81, 56, 55, 40]
	            },
	            {
	                label: "My Second dataset",
	                fillColor: "rgba(26,179,148,0.5)",
	                strokeColor: "rgba(26,179,148,0.8)",
	                highlightFill: "rgba(26,179,148,0.75)",
	                highlightStroke: "rgba(26,179,148,1)",
	                data: [28, 48, 40, 19, 86, 27, 90]
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
	    }

	    var ctx = document.getElementById("barChart").getContext("2d");
	    var myNewChart = new Chart(ctx).Bar(barData, barOptions);
	},

	componentDidMount() {
        this.initChart();
	},
	render() {
	    return (
	    	<div>
	    		<canvas id="barChart"></canvas>
	    	</div>
	    )
	}

});