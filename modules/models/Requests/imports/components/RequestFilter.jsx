/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React, { Component, PropTypes } from 'react';

import { NavListDropDown } from '/modules/ui/MaterialNavigation';

import { Select } from '/modules/ui/MaterialInputs';


export default class RequestFilter extends Component {

  constructor( props ){
    super( props );

    this.state = {
      item: props.items[0],
    };
  }

  render() {
    return (
      <div style = { { position:"relative", zIndex:1300 } }>
        <h5 style= { { margin:"0px 0px 0px 0px"} }>Request filter</h5>
        <Select
          value = { this.state.item }
          items       = { this.props.items }
          onChange    = { ( item ) => {
             this.setState( { item: item } );
             if(this.props.onChange){
               this.props.onChange( {"status": { [item === "All" ? '$nin' : '$in']: item === "All" ? [] : [ item ] } } );
             }
           }
         }
        />
      </div>
    )
  }
}
