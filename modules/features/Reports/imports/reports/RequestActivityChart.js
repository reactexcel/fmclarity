import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Menu } from '/modules/ui/MaterialNavigation';
import { RequestSearch, Requests } from '/modules/models/Requests';

import LoaderSmall from '/modules/ui/Loader/imports/components/LoaderSmall';
import { hideLoader } from '/modules/ui/Loader/imports/components/Loader';

if ( Meteor.isClient ) {
import Chart from 'chart.js';
}

export default class RequestActivityChart extends PureComponent {
  lineChart = null;
  lineOptions = {
    scales: {
      xAxes: [{ gridLines: { display: false } }],
      yAxes: [{ ticks: { beginAtZero: true } }]
    }
  };
  lineData = {
    labels: [''],
    datasets: [{
      label: "Complete",
      backgroundColor: "rgba(193,217,245,0.3)",
      borderColor: "rgba(193,217,245,1)",
      pointBackgroundColor: "rgba(193,217,245,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      data: [0]
    }, {
      label: "Open",
      backgroundColor: "rgba(117,170,238,0.3)",
      borderColor: "rgba(117,170,238,1)",
      pointBackgroundColor: "rgba(117,170,238,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      data: [0]
    }]
  };

  constructor(props) {
    super(props);
    let team = props.team;
    let facility = props.facility;

    this.state = {
      viewConfig: {
        format: 'MMM',
        title: "[since] MMMM YYYY",
        startDate: moment().subtract( 2, 'months' ).startOf( 'month' ),
        endDate: moment().endOf( 'month' ),
        groupBy: 'month'
      },
      expandAll: false,
      openSeries: [],
      closedSeries: [],
      labels: [],
    };

    this.resetChart();
  };

  getMenu = () => {
    return [ 
    {
      label: ( "3 Months" ),
      run: () => {
        let startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
        let endDate = moment().endOf( 'month' );
        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "[since] MMMM YYYY",
            groupBy: 'month',
            startDate,
            endDate
          }
        }, () => {
          this.updateRequestData(startDate, endDate);
        });
      }
    }, {
      label: ( "6 Months" ),
      run: () => {
        let startDate = moment().subtract( 5, 'months' ).startOf( 'month' );
        let endDate = moment().endOf( 'month' );

        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "[since] MMMM YYYY",
            startDate,
            endDate,
            groupBy: 'month',
          }
        }, () => {
          this.updateRequestData(startDate, endDate);
        });
      }
    }, {
      label: ( "Year" ),
      run: () => {
        let startDate = moment().startOf('year');
        let endDate = moment().endOf('year');
        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "YYYY",
            groupBy: 'month',
            startDate,
            endDate,
          }
        }, () => {
          this.updateRequestData(startDate, endDate);
        });
      }
    }];
  };

  printChart = () => {
    this.setState({
      expandAll: true
    });

    setTimeout(() => {
      window.print();
      this.setState({
        expandAll: false
      });
    }, 200);
  };

  clearChart = callback => {
    this.setState(
      {
        openSeries: [],
        closedSeries: []
      },
      () => {
        this.updateChart();
        if (_.isFunction(callback)) {
          callback();
        }
      }
    );
  };

  initChart = () => {
    let ctx = document.getElementById( "line-chart" ).getContext("2d");
    this.lineChart = new Chart(ctx, {
      type: "line",
      data: this.lineData,
      options: this.lineOptions
    });
  };

  updateChart = () => {
    if (this.lineChart) {
      this.lineChart.data.datasets[0].data = this.state.closedSeries || [];
      this.lineChart.data.datasets[1].data = this.state.openSeries || [];
      this.lineChart.data.labels = this.state.labels || [];
      this.lineChart.update();
    }
  };

  resetChart = () => {
    if (this.lineChart) {
      this.lineChart.destroy();
      this.initChart();
    }
  };

  updateRequestData = (startDate, endDate) => {
    this.clearChart(() => {
      this.props.configVar.set({
        start: moment(startDate).toDate(),
        end: moment(endDate).toDate()
      });
    });
  };
  
  formatDateResponseToChart = (response) => {
    let config = this.props.configVar.get();
    let start = moment(config.start);
    let end = moment(config.end);
    let now = start.clone();

    let previousLabel = '';
    let chartItems = {
      labels: [],
      open: [],
      closed: []
    };

    while (!now.isAfter(end)) {
      let startDate = now.clone();

      let label = moment(startDate).format(this.state.viewConfig.format);
      if ( label !== previousLabel ) {
        previousLabel = label;
      } else {
        label = '';
      }

      chartItems.labels.push(label);
      let open = 0;
      let closed = 0;

      for (let key in response) {
        let item = response[key];
        let itemDate = moment(item.date);
        if (now.isSame(itemDate, 'year') && now.isSame(itemDate, 'month')) {
          open = item.openRequests;
          closed = item.closedRequests;
          break;
        }
      }

      chartItems.open.push(open);
      chartItems.closed.push(closed);
      now.add(1, this.state.viewConfig.groupBy);
    }

    return chartItems;
  };

  componentDidMount() {
    this.initChart();
    hideLoader();
  }

  componentWillReceiveProps(props) {
    let data = this.formatDateResponseToChart(props.data);
    this.setState({
      closedSeries: data.closed,
      openSeries: data.open,
      labels: data.labels
    }, this.updateChart);
  }

  componentDidUpdate() {
    // this.updateChart();
  }

  render() {
    let title = this.state.viewConfig.startDate.format(this.state.viewConfig.title);
    let facility = this.props.facility;
    let facilities = this.props.facilities;
    let headerTitle = <span>Request activity {title} {facility && facility.name ? " for " + facility.name : (facilities && facilities.length == '1') ? "for " + facilities[0].name : " for all facilities"}</span>
    
    let loader = !this.props.ready ? <LoaderSmall/> : null; 
    return (
      <div>
        { loader }
        <Menu items={this.getMenu()} />
        <div className="ibox-title">
          <h2>{headerTitle}</h2>
        </div>
        <div className="ibox-content">
          <div className="row">
            <div className="col-sm-12">
              <div id="line-chart-wrapper">
                <canvas id="line-chart"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RequestActivityChart.propTypes = {
  facility: PropTypes.object,
  facilities: PropTypes.array,
  team: PropTypes.object.isRequired,
};