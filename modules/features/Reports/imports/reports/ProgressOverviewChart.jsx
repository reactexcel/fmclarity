import React from "react";
import PropTypes from 'prop-types';
import {ReactMeteorData} from 'meteor/react-meteor-data';

import {Requests} from '/modules/models/Requests';
import { Menu } from '/modules/ui/MaterialNavigation';
import ProgressArc from '../components/ProgressArc';

import moment from 'moment';

export default class ProgressOverviewChart extends React.Component {

  constructor(props) {
    super(props);

    let startDate = moment().subtract(2, 'months').startOf('month');
    let endDate = moment().endOf('month');
    let period = {number: 3, unit: 'month'};

    this.state = {
      team: props.team,
      facility: props.facility,
      startDate: startDate,
      endDate: endDate,
      period: period,
      title: startDate.format("[since] MMMM YYYY"),
      results: {
        New: {thisPeriod: 0, lastPeriod: 0},
        Issued: {thisPeriod: 0, lastPeriod: 0},
        Complete: {thisPeriod: 0, lastPeriod: 0}
      }
    };
  }

  componentDidMount() {
    let facility = this.props.facility;
    let team = this.props.team;

    this.setState({
      title: this.state.startDate.format("[since] MMMM YYYY")
    });
    this.updateStats();
  }

  clearStats = (callback) => {
    this.setState({
      results: {
        New: {thisPeriod: 0, lastPeriod: 0},
        Issued: {thisPeriod: 0, lastPeriod: 0},
        Complete: {thisPeriod: 0, lastPeriod: 0}
      }
    }, () => {
      if (_.isFunction(callback)) {
        callback();
      }
    });
  };

  updateStats() {
    let {startDate, endDate, period, facility, team} = this.state;

    let data = {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      period: period,
      facilityQuery: facility || Session.get('selectedFacility'),
      teamQuery: team || Session.get('selectedTeam')
    };

    Meteor.call('getProgressOverviewStats', data, (error, results) => {
      if (!error) {
        this.setState({ results })
      }
    })
  }

  componentWillReceiveProps(props) {
    if (props.facility || props.team) {
      let update = {};
      
      update['facility'] = props.facility;
      if (props.team) {
        update['team'] = props.team;
      }

      let doUpdate = (
        ((this.state.team && props.team) && (props.team._id !== this.state.team._id)) ||
        Boolean(props.facility) || (Boolean(this.state.facility) && !Boolean(props.facility))
      );

      doUpdate = !doUpdate ? Boolean(props.facility) : doUpdate;

      this.setState(update, () => {        
        if (doUpdate) {
          this.clearStats(() => {
            this.updateStats();
          });
        }
      });
    }
  }

  getMenu() {
    return [{
      label: ("Day"),
      run: () => {
        this.setState({
          startDate: moment().startOf('day'),
          endDate: moment().endOf('day'),
          period: {number: 1, unit: 'day'},
        }, () => {
          this.setState({
            title: this.state.startDate.format('[for] dddd Do MMMM')
          });
          
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }, {
      label: ('Week'),
      run: () => {
        this.setState({
          startDate: moment().startOf('week'),
          endDate: moment().endOf('week'),
          period: {number: 1, unit: 'week'}
        }, () => {
          this.setState({
            title: this.state.startDate.format('[for week starting] Do MMMM')
          });
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }, {
      label: ('Month'),
      run: () => {
        this.setState({
          startDate: moment().startOf('month'),
          endDate: moment().endOf('month'),
          period: {number: 1, unit: 'month'},
        }, () => {
          this.setState({
            title: this.state.startDate.format('[for] MMMM YYYY')
          });
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }, {
      label: ('3 Months'),
      run: () => {
        this.setState({
          startDate: moment().subtract(2, 'months').startOf('month'),
          endDate: moment().endOf('month'),
          period: {number: 3, unit: 'month'},
        }, () => {
          this.setState({
            title: this.state.startDate.format("[for 3 months since] MMMM YYYY")
          });
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }, {
      label: ('6 Months'),
      run: () => {
        this.setState({
          startDate: moment().subtract(5, 'months').startOf('month'),
          endDate: moment().endOf('month'),
          period: {number: 6, unit: 'month'}
        }, () => {
          this.setState({
            title: this.state.startDate.format("[for 6 months since] MMMM YYYY")
          });
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }, {
      label: ('Year'),
      run: () => {
        this.setState({
          startDate: moment().startOf('year'),
          endDate: moment().endOf('year'),
          period: {number: 1, unit: 'year'},
        }, () => {
          this.setState({
            title: this.state.startDate.format("[for] YYYY")
          });
          this.clearStats(() => {
            this.updateStats();
          });
        });
      }
    }];
  }

  render() {
    let results = this.state.results;
    let facility = this.props.facility;
    let facilities = this.props.facilities;

    return (
      <div>
        <Menu items={this.getMenu()}/>
        <div className="ibox-title">
          <h2>Overview {this.state.title} {facility&&facility.name?" for "+facility.name: (facilities && facilities.length === 1) ? "for "+ facilities[0].name : " for all facilities"}</h2>
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

ProgressOverviewChart.propTypes = {
  facility: PropTypes.object,
  team: PropTypes.object.isRequired,
};