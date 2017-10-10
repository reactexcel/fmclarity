import React, { PureComponent } from 'react';

import { Menu } from '/modules/ui/MaterialNavigation';
import { RequestSearch, Requests } from '/modules/models/Requests';

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

    let {openQuery, closedQuery } = this.getQueries(team, facility);

    this.state = {
      viewConfig: {
        format: 'MMM',
        title: "[since] MMMM YYYY",
        startDate: moment().subtract( 2, 'months' ).startOf( 'month' ),
        endDate: moment().endOf( 'month' ),
        groupBy: 'week'
      },
      expandAll: false,
      openQuery: openQuery,
      closedQuery: closedQuery,
      openSeries: [],
      closedSeries: [],
      labels: [],
      team: team,
      facility: facility,
      facilities: []
    };

    this.resetChart();
  };

  getQueries = (teamObj, facilityObj) => {
    let openQuery = { status: { $ne: 'Complete' } };
    let closedQuery = { status: "Complete" };

    let team = teamObj ? teamObj : this.state && this.state.team ? this.state.team : null;
    let facility = facilityObj ? facilityObj : this.state && this.state.facility ? this.state.facility : null;

    if (team) {
      openQuery['team._id'] = team._id;
      closedQuery['team._id'] = team._id;
    }

    if (facility) {
      openQuery['facility._id'] = facility._id;
      closedQuery['facility._id'] = facility._id;
    }

    return {
      openQuery,
      closedQuery,
    }
  }

  getMenu = () => {
    return [ {
      label: ( "Day" ),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'hA',
            title: "dddd Do MMMM",
            startDate: moment().startOf('day'),
            endDate: moment().endOf('day'),
            groupBy: 'hour'
          }
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ("Week"),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'ddd',
            title: "for [week starting] Do MMMM",
            startDate: moment().startOf( 'week' ),
            endDate: moment().endOf( 'week' ),
            groupBy: 'day'
          }
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ( "Month" ),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'D',
            title: "MMMM YYYY",
            startDate: moment().startOf( 'month' ),
            endDate: moment().endOf( 'month' ),
            groupBy: 'day'
          }
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ( "3 Months" ),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "[since] MMMM YYYY",
            startDate: moment().subtract( 2, 'months' ).startOf( 'month' ),
            endDate: moment().endOf( 'month' ),
            groupBy: 'month',
          }
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ( "6 Months" ),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "[since] MMMM YYYY",
            startDate: moment().subtract( 5, 'months' ).startOf( 'month' ),
            endDate: moment().endOf( 'month' ),
            groupBy: 'month',
          }
        }, () => {
          this.onMenuClick();
        });
      }
    }, {
      label: ( "Year" ),
      run: () => {
        this.setState({
          viewConfig: {
            format: 'MMM',
            title: "YYYY",
            startDate: moment().startOf( 'year' ),
            endDate: moment().endOf( 'year' ),
            groupBy: 'month',
          }
        }, () => {
          this.onMenuClick();
        });
      }
    } ];
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

  onMenuClick = () => {
    this.getRequestData();
  };

  initChart = () => {
    let ctx = document.getElementById( "line-chart" ).getContext("2d");
    this.lineChart = new Chart(ctx, {
      type: "line",
      data: this.lineData,
      options: this.lineOptions
    });

    this.getRequestData();
  };

  getRequestData = () => {
    let config = {
      start: this.state.viewConfig.startDate.toDate(),
      end: this.state.viewConfig.endDate.toDate(),
      format: this.state.viewConfig.format,
      groupBy: this.state.viewConfig.groupBy
    };

    Meteor.call('Requests.getRequestCountPerMonth', Meteor.user(), this.state.openQuery, config, (error, response) => {
      let items = this.formatDateResponseToChart(response, config);
      this.setState({
        openSeries: items.sets,
        labels: items.labels
      }, this.updateChart());
    });

    Meteor.call('Requests.getRequestCountPerMonth', Meteor.user(), this.state.closedQuery, config, (error, response) => {
      let items = this.formatDateResponseToChart(response, config);
      this.setState({
        closedSeries: items.sets
      }, this.updateChart());
    });

  };

  formatDateResponseToChart = (response, config) => {
    let start = moment(config.start);
    let end = moment(config.end);

    let now = start.clone();
    let previousLabel = '';
    let chartItems = {
      labels: [],
      sets: []
    };

    while (!now.isAfter(end)) {
      let startDate = now.clone();

      let label = moment(startDate).format(config.format);
      if ( label !== previousLabel ) {
        previousLabel = label;
      } else {
        label = '';
      }
      chartItems.labels.push(label);
      let count = 0;
      for (let item of response) {
        if (count > 0) {
          break;
        }
        let monthYearCondition = (item.createdAt.month === (now.month() + 1) &&
          item.createdAt.year === now.year());

        switch (config.groupBy) {
          case 'week':
            if (monthYearCondition && item.createdAt.week === now.week()) {
              count = item.count;
            }
            break;
          case 'day':
            if (monthYearCondition &&
                item.createdAt.week === now.week() &&
                item.createdAt.day === now.date()
            ) {
              count = item.count;
            }
            break;
          case 'hour':
            if (monthYearCondition &&
                item.createdAt.week === now.week() &&
                item.createdAt.day === now.date() &&
                item.createdAt.hour === now.hour()
            ) {
              count = item.count;
            }
            break;
          default:
            if (monthYearCondition) {
              count = item.count;
            }
            break;
        }
      }
      chartItems.sets.push(count);
      now.add(1, config.groupBy);
    }
    return chartItems;
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

      if (this.lineChart) {
        this.setState(update, () => {
            this.setState(this.getQueries(), () => {
              this.resetChart();
            });
        });
      }
    }
  }

  componentDidUpdate() {
    this.updateChart();
  }

  render() {
    let title = this.state.viewConfig.startDate.format(this.state.viewConfig.title);
    let facility = this.state.facility;
    let facilities = this.state.facilities;
    let headerTitle = <span>Request activity {title} {facility && facility.name ? " for " + facility.name : (facilities && facilities.length == '1') ? "for " + facilities[0].name : " for all facilities"}</span>

    return (
      <div>
        <button className="btn btn-flat pull-left noprint" onClick={() => this.printChart()}>
          <i className="fa fa-print" aria-hidden="true"/>
        </button>
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