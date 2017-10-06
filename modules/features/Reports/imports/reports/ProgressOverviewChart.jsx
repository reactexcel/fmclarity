import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Requests } from '/modules/models/Requests';
import { Menu } from '/modules/ui/MaterialNavigation';

import moment from 'moment';

export default ProgressOverviewChart = React.createClass( {

        startComputation() {
            let count = 0;
            this.computation = Tracker.autorun( () => {
              console.log('Tracker running ' + moment().toDate());
                let startDate = moment().subtract( 2, 'months' ).startOf( 'month' ),
                    endDate = moment().endOf( 'month' ),
                    period = { number: 3, unit: 'month' };

                var facilityQuery = Session.get( 'selectedFacility' );
                var teamQuery = Session.get( 'selectedTeam' );
                this.updateStats( { startDate, endDate, period, facilityQuery, teamQuery } );
            } );

        },

        componentDidMount() {
            this.updateStats = _.debounce(this.updateStats, 1000);
            let startDate = moment().subtract( 2, 'months' ).startOf( 'month' ),
                endDate = moment().endOf( 'month' ),
                period = { number: 3, unit: 'month' };

            this._mounted = true;

            this.setState( {
                title: startDate.format( "[since] MMMM YYYY" )
            } );

            setTimeout( () => { this.startComputation() }, 0 );
        },

        componentWillUnmount() {
            this._mounted = false;
            if ( this.computation ) {
                this.computation.stop();
            }
        },

        updateStats( { startDate, endDate, period, facilityQuery, teamQuery } ) {
            console.log('calling update stats ' + moment().toDate());
            //console.log( 'updating stats' );

            Meteor.call( 'getProgressOverviewStats', {
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                period: period,
                facilityQuery: facilityQuery || Session.get( 'selectedFacility' ),
                teamQuery: teamQuery || Session.get( 'selectedTeam' )
            }, ( error, results ) => {
                //console.log( { error, results } );
                if ( !error && this._mounted ) {
                    this.setState( {
                        results
                    } )
                }
            } )
        },

        getInitialState() {
            let startDate = moment().subtract( 2, 'months' ).startOf( 'month' );
            return {
                title: startDate.format( "[since] MMMM YYYY" ),
                results: {
                    New: { thisPeriod: 0, lastPeriod: 0 },
                    Issued: { thisPeriod: 0, lastPeriod: 0 },
                    Complete: { thisPeriod: 0, lastPeriod: 0 }
                }
            };
        },

        getMenu() {
            var component = this;
            return [ {
                label: ( "Day" ),
                run: () => {

                    let startDate = moment().startOf( 'day' ),
                        endDate = moment().endOf( 'day' ),
                        period = { number: 1, unit: 'day' };

                    this.setState( {
                        title: startDate.format( "[for] dddd Do MMMM" )
                    } );

                    this.updateStats( { startDate, endDate, period } );
                }
            }, {
                label: ( "Week" ),
                run: () => {

                    let startDate = moment().startOf( 'week' ),
                        endDate = moment().endOf( 'week' ),
                        period = { number: 1, unit: 'week' };

                    this.setState( {
                        title: startDate.format( "[for week starting] Do MMMM" )
                    } );

                    this.updateStats( { startDate, endDate, period } );
                }
            }, {
                label: ( "Month" ),
                run: () => {

                    let startDate = moment().startOf( 'month' ),
                        endDate = moment().endOf( 'month' ),
                        period = { number: 1, unit: 'month' };

                    component.setState( {
                        title: startDate.format( "[for] MMMM YYYY" )
                    } );

                    this.updateStats( { startDate, endDate, period } );
                }
            }, {
                label: ( "3 Months" ),
                run: () => {

                    let startDate = moment().subtract( 2, 'months' ).startOf( 'month' ),
                        endDate = moment().endOf( 'month' ),
                        period = { number: 3, unit: 'month' };

                    component.setState( {
                        title: startDate.format( "[for 3 months since] MMMM YYYY" )
                    } );

                    this.updateStats( { startDate, endDate, period } );

                }
            }, {
                label: ( "6 Months" ),
                run: () => {

                    let startDate = moment().subtract( 5, 'months' ).startOf( 'month' ),
                        endDate = moment().endOf( 'month' ),
                        period = { number: 6, unit: 'month' };

                    component.setState( {
                        title: startDate.format( "[for 6 months since] MMMM YYYY" )
                    } );

                    this.updateStats( { startDate, endDate, period } );

                }
            }, {
                label: ( "Year" ),
                run: () => {

                    let startDate = moment().startOf( 'year' ),
                        endDate = moment().endOf( 'year' ),
                        period = { number: 1, unit: 'year' }

                    component.setState( {
                        title: startDate.format( "[for] YYYY" )
                    } );

                    this.updateStats( { startDate, endDate, period } );

                }
            } ];
        },

        render() {
            var results = this.state.results;
            var facility = Session.get( 'selectedFacility' );
            return (
                <div>
                <Menu items={this.getMenu()} />
                <div className="ibox-title">
                    <h2>Overview {this.state.title} {facility&&facility.name?" for "+facility.name:" for all facilities"}</h2>
                </div>
                <div className="ibox-content" style={{padding:"0px 20px 30px 20px"}}>
                    <div style={{textAlign:"center",clear:"both"}}>
                            <ProgressArc 
                                title="New Requests" 
                                thisPeriod = {results['New'].thisPeriod}
                                lastPeriod = {results['New'].lastPeriod}
                                color="#3ca773"
                            />
                            <ProgressArc 
                                title="Issued Requests" 
                                thisPeriod = {results['Issued'].thisPeriod}
                                lastPeriod = {results['Issued'].lastPeriod}
                                color="#b8e986"
                            />
                            <ProgressArc 
                                title="Closed Requests" 
                                thisPeriod = {results['Complete'].thisPeriod}
                                lastPeriod = {results['Complete'].lastPeriod}
                                color="#333333"
                            />
                        {/*
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Open Quotes" 
                                thisPeriod = {4}
                                lastPeriod = {3}
                                color="#999999"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Expired Insurance" 
                                thisPeriod = {5}
                                lastPeriod = {0}
                                color="#666666"
                            />
                        </div>
                        <div className="col-xs-4" style={{padding:0}}>
                            <ProgressArc 
                                title="Supplier Reviews" 
                                thisPeriod = {10}
                                lastPeriod = {11}
                                color="#333333"
                            />
                        </div>
                        */}
                    </div>
                </div>
            </div>
            )
        }
    } )
    /*
    Reports.register({
        id:"requests-overview-chart",
        name:"Requests Overview Chart",
        content:ProgressOverviewChart
    })
    */
