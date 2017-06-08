import React from "react"
if ( Meteor.isClient ) {
	import Chart from 'chart.js';
}
//import { ComplianceEvaluationService } from '/modules/features/Compliance';

export default ComplianceChartForServices = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {
		var facility = Session.get( 'selectedFacility' );
		var services = null;
		//var color = ['#3F51B5','#5C6BC0','#7986CB','#9FA8DA','#1565C0','#1976D2','#1E88E5','#2196F3','#42A5F5','#64B5F6','#90CAF9','#81D4FA','#4FC3F7','#29B6F6','#039BE5','#0288D1','#0277BD']
		var numRules = 0,
			numPassed = [],
			numFailed = [],
			percPassed = [],
			serviceName = [],
			displayLegend = true,
			backgroundColor = [];
			hoverBorderColor = [];
		if ( facility ){
			services = facility.servicesRequired;
			let i = 0;
			services.map( (service, idx) => {
				if(service && service.data && service.data.complianceRules && service.data.complianceRules.length){
					let complianceRules = service.data.complianceRules;
					if( service.children ) {
						service.children.map( ( subservice, idx ) => {
							if( subservice.data && subservice.data.complianceRules )
								complianceRules = complianceRules.concat( subservice.data.complianceRules );
						})
					}
					if ( complianceRules ) {
						numRules = complianceRules.length;
						results = ComplianceEvaluationService.evaluate( complianceRules, facility );
						if ( results ) {
							numPassed = numPassed.concat(results.passed);
							numFailed = numFailed.concat(results.failed);
							percPassed = percPassed.concat( Math.ceil( ( results.passed / numRules ) * 100 ) );
							let r = ( service.name.charCodeAt( service.name.length - 2 ) % 20 ) * 15;
							let g = ( service.name.charCodeAt( service.name.length - 1 ) % 20 ) * 15;
							let b = ( service.name.charCodeAt( service.name.length - 3 ) % 20 ) * 15;
							let color = 'rgb(' + r + ',' + g + ',' + b + ')';
							backgroundColor = backgroundColor.concat(color);
							hoverBorderColor = hoverBorderColor.concat('#FAFAFA');
							backgroundColor = backgroundColor.concat(color)
							hoverBorderColor = hoverBorderColor.concat('#FAFAFA')
							if ( service.name.length > 15 ) {
								service.name = service.name.substring( 0, 13 ) + '...';
							}
							serviceName = serviceName.concat(service.name)
							displayLegend = serviceName.length >=3 ? false : true
						}
					}
				}
			})
		}
		return { facility, services, numRules, numPassed, numFailed, percPassed, serviceName,backgroundColor,displayLegend,hoverBorderColor }
	},

	componentDidMount() {
		this.resetChart();
	},

	componentDidUpdate() {
		this.resetChart();
		this.updateChart();
	},

	getChartConfiguration() {
		return {
			pieData: {
				labels: this.data.serviceName || [ '' ],
				datasets: [ {
					data:this.data.percPassed || [ 0 ],
					backgroundColor:this.data.backgroundColor || [0],
					hoverBackgroundColor:this.data.backgroundColor || [0],
					borderColor:this.data.backgroundColor || [0],
					hoverBorderColor:this.data.hoverBorderColor || [0]
				} ]
			},
			pieOptions: {
				cutoutPercentage:0,
				rotation:-0.1 * Math.PI,
				circumference:2 * Math.PI,
				animation:{
					animateRotate:true,
					animateScale:false
				},
				layout: {
					padding: 0,
				},
				legend: {
                    //display: this.data.displayLegend
					display:false
                },
			}
		}

	},

	resetChart() {
		var config = this.getChartConfiguration();
		if ( this.chart ) {
			this.chart.destroy();
		}
		var ctx = document.getElementById( "pie-chart1" ).getContext( "2d" );
		this.chart = new Chart( ctx, {
			type: 'pie',
			data: config.pieData,
			options: config.pieOptions
		} );
		document.getElementById('js-legend-breakdown').innerHTML = this.chart.generateLegend();
	},

	updateChart() {
		this.chart.data.datasets[ 0 ].data = this.data.percPassed;
		this.chart.data.labels = this.data.serviceName;
		this.chart.data.datasets[0].backgroundColor = this.data.backgroundColor;
		this.chart.data.datasets[0].hoverBackgroundColor = this.data.backgroundColor;
		this.chart.data.datasets[0].borderColor = this.data.backgroundColor;
		this.chart.data.datasets[0].hoverBorderColor = this.data.hoverBorderColor;
		//this.chart.option.legend.display = this.data.displayLegend;
		this.chart.update();
	},

	render() {
		var data = this.data;
			return (
				<div>
				<div className="ibox-title">
					<h2>Non-compliance Breakdown</h2>
				</div>
				<div className="ibox-content">
					<div style={{textAlign:"center",clear:"both"}}>
						<div>
							<canvas id="pie-chart1"></canvas>
						</div>
						<div id="js-legend-breakdown" className="chart-legend-breakdown" style={{'maxHeight':'70px','overflow':'auto','marginTop':'20px'}}></div>
					</div>
				</div>
			</div>
			)
	}
} )
