

/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import PropTypes from 'prop-types';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { Requests } from '/modules/models/Requests';
import { ServicesRequestsView } from '/modules/mixins/Services';

import moment from 'moment';


if ( Meteor.isClient ) {
import Chart from 'chart.js';
}

/**
 * @class 			RequestBreakdownChart
 * @memberOf 		module:features/Reports
 */
export default class RequestBreakdownChart extends React.Component {
  barChart = null;
  barData = {
    labels: [''],
    datasets: [ {
      backgroundColor: "rgba(117,170,238,0.8)",
      borderColor: "rgba(117,170,238,1)",
      hoverBackgroundColor: "rgba(117,170,238,0.5)",
      hoverBorderColor: "rgba(117,170,238,1)",
      data: [0]
    } ]
  };
  barOptions = {
    scales: {
      xAxes: [ {
        ticks: {
          autoSkip: false,
        }
      } ],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    }
  };

  constructor(props) {
    super(props);

    let startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
    let title = startDate.format("[since] MMMM YYYY");
    this.state = {
      startDate: startDate,
      title: title,
      expandall: false,
      sets: [],
      labels: []
    };
  }

  getMeteorData() {

    var startDate = this.state.startDate;
    var query = {
      createdAt: {
        $gte: this.state.startDate.toDate()
      },
      status:{$ne:'Deleted'}
    }

    var facility = Session.get( 'selectedFacility' );
    if ( facility ) {
      query[ "facility._id" ] = facility._id;
    }

    var team = Session.get( 'selectedTeam' );
    //var team = Teams.findOne({name:"Kaplan Australia Pty Ltd"});
    if ( team ) {
      query[ "team._id" ] = team._id;
    }
    const handle = Meteor.subscribe('User: Facilities, Requests');

    var requests = Requests.find( query );

    var buckets = {};
    var costs = {};
    var labels = [];
    var counts = [];
    var set = [];
    requests.map( function( i ) {
      var serviceName;
      if ( i.service && i.service.name ) {
        serviceName = i.service.name;
        if ( serviceName.length > 15 ) {
          serviceName = serviceName.substring( 0, 13 ) + '...';
        }
        if ( !costs[ serviceName ] ) {
          costs[ serviceName ] = 0;
        }
        if ( !buckets[ serviceName ] ) {
          labels.push( serviceName );
          buckets[ serviceName ] = [];
        }
        buckets[ serviceName ].push( i );
        var newCost = parseInt( i.costThreshold );
        if ( _.isNaN( newCost ) ) {
          newCost = 0;
        }
        costs[ serviceName ] += newCost;
      }
    } );
    labels.map( function( serviceName, idx ) {
      counts[ idx ] = buckets[ serviceName ].length;
      set[ idx ] = costs[ serviceName ];
    } );

    return {
      facility: facility,
      labels: labels,
      set: set, //costs//counts
      buckets: buckets,
      ready: handle.ready()
    }
  }

  printChart() {
    var component = this;
    component.setState( {
      expandall: true
    } );

    setTimeout(function(){
      window.print();
      component.setState( {
        expandall: false
      } );
    },200);
  }

  getMenu() {
    return [ {
      label: ( "Day" ),
      run: () => {
        let startDate = moment().startOf('day');
        this.setState({
          startDate: startDate,
          title: startDate.format("[on] dddd Do MMMM")
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ("Week"),
      run: () => {
        let startDate = moment().startOf('week');
        this.setState({
          startDate: startDate,
          title: startDate.format("[for week starting] Do MMMM")
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ("Month"),
      run: () => {
        let startDate = moment().startOf('month');
        this.setState({
          startDate: startDate,
          title: startDate.format("[since] MMMM YYYY")
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ("3 Months"),
      run: () => {
        let startDate = moment().subtract(2, 'months' ).startOf('month');
        this.setState({
          startDate: startDate,
          title: startDate.format("[since] MMMM YYYY")
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ("6 Months"),
      run: () => {
        let startDate = moment().subtract( 5, 'months' ).startOf( 'month' );
        this.setState({
          startDate: startDate,
          title: startDate.format("[since] MMMM YYYY")
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ( "Year" ),
      run: () => {
        let startDate = moment().startOf('year');
        this.setState({
          startDate: startDate,
          title: startDate.format("YYYY")
        }, () => {
          this.onMenuClick();
        });
      }
    } ];
  }

  onMenuClick = () => {
    this.getRequestData();
  };

  initChart = () => {
    let ctx = document.getElementById("bar-chart").getContext( "2d" );
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: this.barData,
      options: this.barOptions
    });

    this.getRequestData();
  };

  updateChart = () => {
    if (this.barChart) {
      this.barChart.data.datasets[0].data = this.state.sets || [];
      this.barChart.data.labels = this.state.labels || [];
      this.barChart.update();
    }
  };


  resetChart = () => {
    if (this.barChart) {
      this.barChart.destroy();
      this.initChart();
    }
  };

  getRequestData = () => {
    let config = {
      date: moment(this.state.startDate).toDate(),
      team: this.props.team,
      facility: this.props.facility
    };
    this.props.getRequestBreakdown(config, (response) => {
      let items = this.formatDateResponseToChart(response);
      this.setState({
        sets: items.sets,
        labels: items.labels
      }, () => {
        this.updateChart()
      });
    });
  };

  formatDateResponseToChart = (response) => {
    let chartItems = {
      labels: [],
      sets: []
    };

    for (let item of response) {
      let serviceName = item.serviceName;
      if ( serviceName.length > 15 ) {
        serviceName = serviceName.substring( 0, 13 ) + '...';
      }
      chartItems.labels.push(serviceName);
      chartItems.sets.push(item.totalCostThreshold);
    }

    return chartItems;
  };

  componentDidMount() {
    this.initChart();
  }

  componentWillReceiveProps(props) {
    if (props.facility || props.team) {
      let update = {};
      if (props.facility) {
        update['facility'] = props.facility;
      }
      if (props.team) {
        update['team'] = props.team;
      }

      if (this.barChart) {
        this.setState(update, () => {
          this.resetChart();
        });
      }
    }
  }

  componentDidUpdate() {
    this.updateChart();
  }

  render() {
    let facility = this.props.facility;
    let facilities = this.props.facilities;
    return (
			<div>
				<button className="btn btn-flat pull-left noprint"  onClick={this.printChart}>
					<i className="fa fa-print" aria-hidden="true"></i>
				</button>
				<Menu items={this.getMenu()}/>
				<div className="ibox-title">
					<h2>Request breakdown {this.state.title} {facility&&facility.name?" for "+facility.name: (facilities && facilities.length === 1) ? "for "+ facilities[0].name : " for all facilities"}</h2>
				</div>
				<div className="ibox-content">
					<div>
						<canvas id="bar-chart"></canvas>
					</div>
				</div>
			</div>
    )
  }

};

RequestBreakdownChart.propTypes = {
  team: PropTypes.object.isRequired,
  facility: PropTypes.object,
  facilities: PropTypes.array,
  getRequestBreakdown: PropTypes.func.isRequired
};
