/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React, { Component, PropTypes } from 'react';

import { NavListDropDown } from '/modules/ui/MaterialNavigation';

import { Select } from '/modules/ui/MaterialInputs';


export default class RequestFilter extends Component {

    constructor( props ) {
        super( props );

        this.state = {
            item: FlowRouter._current.path == "/requests/completed"? "Complete":props.items[ 0 ] ,
        };
    }

    componentWillReceiveProps( props ){
      this.setState({
          item: FlowRouter._current.path == "/requests/completed"? "Complete":this.state.item ,
      });
    }
    
    render() {
        return (
            <div style = { { position:"relative", zIndex:1300 } }>
                <h5 style= { { margin:"0px 0px 0px 0px"} }>Request filter</h5>
                <Select
                    value       = { this.state.item }
                    items       = { this.props.items }
                    onChange    =
                        { ( item ) => {
                          if (_.contains([ "Closed", "Complete" ], item )) {
                            FlowRouter.go("/requests/completed");
                            this.props.onChange( {"status": { '$in': [ this.state.item ] } } );
                          } else {
                            this.setState( { item: item } );
                            if(this.props.onChange){
                              this.props.onChange( {"status": { '$in': item === "Open" ? ['New','Issued'] : [ item ] } } );
                            }
                          }
                       } }
                />
            </div>
        )
    }
}
