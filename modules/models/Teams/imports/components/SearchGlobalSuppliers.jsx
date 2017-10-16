/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { Text } from '/modules/ui/MaterialInputs';
import { Teams, SupplierStepper } from '/modules/models/Teams';
import { ContactCard } from '/modules/mixins/Members';
import { Modal } from '/modules/ui/Modal';
import { DropFileContainer } from '/modules/ui/MaterialInputs';

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const SearchGlobalSuppliers = React.createClass( {
    getInitialState () {
      return {
        searchResult: [],
        value: ''
  		}
    },

    componentDidMount() {
      $(document).ready(function(){
        $(document).on('click', function(){
          $('#filterList').hide();
        });
        $('#textBox').on('click', function(e){
          e.stopPropagation();
          $('#filterList').show();
        });
      })
    },
    handleChange(newValue) {
      this.setState({
        value: newValue
      })
    },

    handleSelect( value ) {
        this.filter(value);
    },

    addSupplierToFacility(supplier){
      let facility = Session.getSelectedFacility();
      if( facility ) {
        facility.addSupplier( supplier );
        alert('Supplier added to facility.')
        Modal.hide();
      }
    },

    filter(val) {
      if(typeof(val) !== 'string'){
        val = '';
      }
      var reg = new RegExp(val, 'i');
      let query = {name: {$regex: reg}, type: 'contractor'};
      searchTeams = Teams.findAll( query, { sort: { name: 1 } } );
      this.handleChange(val);
      this.setState({
        searchResult: searchTeams
      });
    },

    addNewSupplier(){
      let facility = Session.getSelectedFacility();
      Modal.show( {
				content: <DropFileContainer model = { Teams }>
					<SupplierStepper item = { null } value={this.state.value} onChange = { ( supplier ) => {
					if( facility ) {
						facility.addSupplier( supplier );
					}
				}}
				/>
			</DropFileContainer>
		} )
  },
    render() {
      let searchResult = [];
      !_.isEmpty(this.state.searchResult) && this.state.searchResult.map((supplier, key)=>{
        // var matchStart = supplier.name.toLowerCase().indexOf("" + this.props.value.toLowerCase() + "");
        // var matchEnd = matchStart + this.props.value.length - 1;
        // var beforeMatch = supplier.name.slice(0, matchStart);
        // var matchText = supplier.name.slice(matchStart, matchEnd + 1);
        // var afterMatch = supplier.name.slice(matchEnd + 1);
        // searchResult.push(<div key={key} className="list-Item" onClick={()=>this.handleChange(matchObj)}>{beforeMatch}<strong>{matchText}</strong>{afterMatch}</div>);
        searchResult.push(<div key={key} className="list-Item" onClick={()=>this.addSupplierToFacility(supplier)}><ContactCard item = { supplier }/></div>);
      });
        return (
          <div style={{minWidth:'800px'}}>
              <div style = { {padding:"5px 15px 20px 15px"} } >
                  <div className="row">
                      <div className="col-sm-12">
                        <div className="fuzzy-filter-container">
                          <div id="filterTextBox">
                            <Text
                              placeholder="Search Supplier"
                              value={this.state.value}
                              onChange={(val)=>{
                                this.filter(val);
                                // this.handleChange(val);
                              }}
                              id={'textBox'}
                              onSelect={(val)=>{this.handleSelect(val);}}
                            />
                          </div>
                          {!_.isEmpty(searchResult) ? <div id="filterList" className="filter-list">
                        {searchResult}
                      </div> : null}
                  	   </div>
                      </div>
                      <div className="col-sm-12">
                        {
                          _.isEmpty(this.state.searchResult) ? <span style={{'float':'right','marginRight':'1%'}}>
                            <button
                                title={"Click to add new supplier."}
                                className="btn btn-flat btn-primary"
                                onClick={(event)=>{
                                    this.addNewSupplier(event)
                                }}
                            >
                                Add new
                            </button>
                        </span>: null
                      }
                      </div>
                  </div>
              </div>
          </div>
        )
    }
} );

export default SearchGlobalSuppliers;
