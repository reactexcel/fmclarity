import React from "react";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import {Requests} from '/modules/models/Requests';
import {Menu} from '/modules/ui/MaterialNavigation';

import moment from 'moment';

export default class ProgressOverviewChart extends React.Component {

  constructor(props) {
    super(props);

    let startDate = moment().subtract(2, 'months').startOf('month');
    this.state = {
      title: startDate.format("[since] MMMM YYYY"),
      results: {
        New: {thisPeriod: 0, lastPeriod: 0},
        Issued: {thisPeriod: 0, lastPeriod: 0},
        Complete: {thisPeriod: 0, lastPeriod: 0}
      }
    };
  }


  startComputation() {
    this.computation = Tracker.autorun(() => {
      this.runComputation();
    });
  }

  runComputation = () => {
      console.log('Tracker running ' + moment().toDate());

      let startDate = moment().subtract(2, 'months').startOf('month');
      let endDate = moment().endOf('month');
      let period = {number: 3, unit: 'month'};

      let facilityQuery = Session.get('selectedFacility');
      let teamQuery = Session.get('selectedTeam');
      this.updateStats({startDate, endDate, period, facilityQuery, teamQuery});
  };

  componentDidMount() {
    this.runComputation = _.debounce(this.runComputation, 500);

    let startDate = moment().subtract(2, 'months').startOf('month');
    let endDate = moment().endOf('month');
    let period = {number: 3, unit: 'month'};

    this._mounted = true;

    this.setState({
      title: startDate.format("[since] MMMM YYYY")
    });

    setTimeout(() => {
      this.startComputation()
    }, 0);
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this.computation) {
      this.computation.stop();
    }
  }

  updateStats({startDate, endDate, period, facilityQuery, teamQuery}) {
    console.log('calling update stats ' + moment().toDate());

    let data = {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      period: period,
      facilityQuery: facilityQuery || Session.get('selectedFacility'),
      teamQuery: teamQuery || Session.get('selectedTeam')
    };

    Meteor.call('getProgressOverviewStats', data, (error, results) => {
      if (!error && this._mounted) {
        this.setState({
          results
        })
      }
    })
  }

  getMenu() {
    return [{
      label: ("Day"),
      run: () => {

        let startDate = moment().startOf('day');
        let endDate = moment().endOf('day');
        let period = {number: 1, unit: 'day'};

        this.setState({
          title: startDate.format('[for] dddd Do MMMM')
        });

        this.updateStats({startDate, endDate, period});
      }
    }, {
      label: ('Week'),
      run: () => {

        let startDate = moment().startOf('week');
        let endDate = moment().endOf('week');
        let period = {number: 1, unit: 'week'};

        this.setState({
          title: startDate.format('[for week starting] Do MMMM')
        });

        this.updateStats({startDate, endDate, period});
      }
    }, {
      label: ('Month'),
      run: () => {

        let startDate = moment().startOf('month');
        let endDate = moment().endOf('month');
        let period = {number: 1, unit: 'month'};

        this.setState({
          title: startDate.format('[for] MMMM YYYY')
        });

        this.updateStats({startDate, endDate, period});
      }
    }, {
      label: ('3 Months'),
      run: () => {

        let startDate = moment().subtract(2, 'months').startOf('month');
        let endDate = moment().endOf('month');
        let period = {number: 3, unit: 'month'};

        this.setState({
          title: startDate.format("[for 3 months since] MMMM YYYY")
        });

        this.updateStats({startDate, endDate, period});

      }
    }, {
      label: ('6 Months'),
      run: () => {

        let startDate = moment().subtract(5, 'months').startOf('month');
        let endDate = moment().endOf('month');
        let period = {number: 6, unit: 'month'};

        this.setState({
          title: startDate.format("[for 6 months since] MMMM YYYY")
        });

        this.updateStats({startDate, endDate, period});

      }
    }, {
      label: ('Year'),
      run: () => {
        let startDate = moment().startOf('year');
        let endDate = moment().endOf('year');
        let period = {number: 1, unit: 'year'};

        this.setState({
          title: startDate.format("[for] YYYY")
        });

        this.updateStats({startDate, endDate, period});
      }
    }];
  }

  render() {
    let results = this.state.results;
    let facility = Session.get('selectedFacility');
    return (
      <div>
        <Menu items={this.getMenu()}/>
        <div className="ibox-title">
          <h2>
            Overview {this.state.title} {facility && facility.name ? " for " + facility.name : " for all facilities"}</h2>
        </div>
        <div className="ibox-content" style={{padding: "0px 20px 30px 20px"}}>
          <div style={{textAlign: "center", clear: "both"}}>
            <ProgressArc
              title="New Requests"
              thisPeriod={results['New'].thisPeriod}
              lastPeriod={results['New'].lastPeriod}
              color="#3ca773"
            />
            <ProgressArc
              title="Issued Requests"
              thisPeriod={results['Issued'].thisPeriod}
              lastPeriod={results['Issued'].lastPeriod}
              color="#b8e986"
            />
            <ProgressArc
              title="Closed Requests"
              thisPeriod={results['Complete'].thisPeriod}
              lastPeriod={results['Complete'].lastPeriod}
              color="#333333"
            />
          </div>
        </div>
      </div>
    )
  }
}
