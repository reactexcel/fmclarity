/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Menu } from '/modules/ui/MaterialNavigation';
import { Requests } from '/modules/models/Requests';
import { ServicesRequestsView } from '/modules/mixins/Services';
import LoaderSmall from '/modules/ui/Loader/imports/components/LoaderSmall';
import { hideLoader } from '/modules/ui/Loader/imports/components/Loader';

import moment from 'moment';

if (Meteor.isClient) {
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
    datasets: [
      {
        backgroundColor: 'rgba(117,170,238,0.8)',
        borderColor: 'rgba(117,170,238,1)',
        hoverBackgroundColor: 'rgba(117,170,238,0.5)',
        hoverBorderColor: 'rgba(117,170,238,1)',
        data: [0]
      }
    ]
  };
  barOptions = {
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    legend: {
      display: false
    }
  };

  constructor(props) {
    super(props);

    let title = moment(this.props.startDate).format('[since] MMMM YYYY');
    this.state = {
      title: title,
      sets: [],
      labels: []
    };

    this.resetChart();
  }

  printChart = () => {
    this.setState({
      expandall: true
    });

    setTimeout(() => {
      window.print();
      this.setState({
        expandall: false
      });
    }, 200);
  };

  getMenu() {
    return [
      {
        label: 'Month',
        run: () => {
          let startDate = moment().startOf('month');
          this.setState(
            {
              title: startDate.format('[since] MMMM YYYY')
            },
            () => {
              this.updateRequestData(startDate);
            }
          );
        }
      },
      {
        label: '3 Months',
        run: () => {
          let startDate = moment()
            .subtract(2, 'months')
            .startOf('month');
          this.setState(
            {
              title: startDate.format('[since] MMMM YYYY')
            },
            () => {
              this.updateRequestData(startDate);
            }
          );
        }
      },
      {
        label: '6 Months',
        run: () => {
          let startDate = moment()
            .subtract(5, 'months')
            .startOf('month');
          this.setState(
            {
              title: startDate.format('[since] MMMM YYYY')
            },
            () => {
              this.updateRequestData(startDate);
            }
          );
        }
      },
      {
        label: 'Year',
        run: () => {
          let startDate = moment().startOf('year');
          this.setState({ title: startDate.format('YYYY') }, () => {
            this.updateRequestData(startDate);
          });
        }
      }
    ];
  }

  initChart = () => {
    let ctx = document.getElementById('bar-chart').getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: this.barData,
      options: this.barOptions
    });
    this.updateRequestData(
      moment()
        .subtract(2, 'months')
        .startOf('month')
    );
    this.updateChart();
  };

  clearChart = callback => {
    this.setState(
      {
        sets: []
      },
      () => {
        this.updateChart();
        if (_.isFunction(callback)) {
          callback();
        }
      }
    );
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

  updateRequestData = startDate => {
    this.clearChart(() => {
      this.props.configVar.set({
        start: moment(startDate).toDate()
      });
    });
  };

  formatDataResponseToChart = response => {
    let chartItems = {
      labels: [],
      sets: []
    };

    for (let key in response) {
      let item = response[key];
      let serviceName = item.serviceName;
      if (serviceName && serviceName.length > 15) {
        serviceName = serviceName.substring(0, 13) + '...';
      }
      chartItems.labels.push(serviceName);
      chartItems.sets.push(item.totalCostThreshold);
    }

    return chartItems;
  };

  componentDidMount() {
    console.log(this.state);
    this.initChart();
    hideLoader();
  }

  componentWillReceiveProps(props) {
    if (props.data) {
      let items = this.formatDataResponseToChart(props.data);
      this.setState(
        {
          sets: items.sets,
          labels: items.labels
        },
        () => {
          this.updateChart();
        }
      );
    }
  }

  componentDidUpdate() {
    // this.updateChart();
  }

  render() {
    let facility = this.props.facility;
    let facilities = this.props.facilities;
    let loader = !this.props.ready ? <LoaderSmall /> : null;
    return (
      <div>
        {loader}
        <Menu items={this.getMenu()} />
        <div className="ibox-title">
          <h2>
            Request breakdown {this.state.title}{' '}
            {facility && facility.name
              ? ' for ' + facility.name
              : facilities && facilities.length === 1
                ? 'for ' + facilities[0].name
                : ' for all facilities'}
          </h2>
        </div>
        <div className="ibox-content">
          <div>
            <canvas id="bar-chart" />
          </div>
        </div>
      </div>
    );
  }
}

RequestBreakdownChart.propTypes = {
  facility: PropTypes.object,
  facilities: PropTypes.array,
  configVar: PropTypes.object.isRequired
};
