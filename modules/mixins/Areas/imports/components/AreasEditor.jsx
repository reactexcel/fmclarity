/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Facilities } from '/modules/models/Facilities';
import { AutoForm } from '/modules/core/AutoForm';
import { Modal } from '/modules/ui/Modal';

/**
 * @class           AreasEditor
 * @memberOf        module:mixins/Areas
 */

 var _component = _selectedArea = _selectedSubArea = null;
const AreasEditor = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        var facility, areas;
        if ( this.props.item ) {
            facility = Facilities.findOne( this.props.item._id );
            if ( facility ) {
                areas = facility.getAreas();
            }
        }
        return {
            facility: facility,
            areas: areas
        }
    },

    getInitialState() {
        return {
            renderAgain: false
        }
    },

    sortAreas(arr) {
        let sortedList = arr.sort( (a, b) => {
            if( a && a.name && b && b.name ) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            } else {
                return 0;
            }
        });
        //return sortedList
        sortedList.map((a1,i)=>{
            if(!_.isEmpty(sortedList[i].children)){
                sortedList[i].children = _.without(sortedList[i].children,null)
                sortedList[i].children = this.sortAreas(sortedList[i].children)
                sortedList[i].children.map((a2,j)=>{
                    if(!_.isEmpty(sortedList[i].children[j].children)){
                        sortedList[i].children[j].children = _.without(sortedList[i].children[j].children,null)
                        sortedList[i].children[j].children = this.sortAreas(sortedList[i].children[j].children)
                    }
                })
            }
        })
        return sortedList
    },

    render() {
        let areas = this.data.areas;
            areas = _.without(areas,null);
            areas = this.sortAreas(areas);
        /*areas.map((a1,i)=>{
            if(!_.isEmpty(areas[i].children)){
                areas[i].children = _.without(areas[i].children,null)
                areas[i].children = this.sortAreas(areas[i].children)
                areas[i].children.map((a2,j)=>{
                    if(!_.isEmpty(areas[i].children[j].children)){
                        areas[i].children[j].children = _.without(areas[i].children[j].children,null)
                        areas[i].children[j].children = this.sortAreas(areas[i].children[j].children)
                    }
                })
            }
        })*/
        return (
            <FacilityAreasEditorInner facility = { this.data.facility } areas = { areas } sortArea={(area)=>{
                this.sortAreas(area)
                this.setState({})
            }}/>
        )
    }
} )


FacilityAreasEditorInner = React.createClass( {

    getInitialState() {
        return {
            facility: this.props.facility,
            selection: [ { name: "Root", children: this.props.areas } ],
            sort: false,
        }
    },

    componentWillReceiveProps( props ) {
        if ( props.facility._id != this.state.facility._id ) {
            this.setState( {
                facility: props.facility,
                selection: [ { name: "Root", children: props.areas } ]
            } )
        }
        if( this.state.sort ){
          this.setState( {
              facility: props.facility,
              selection: [ { name: "Root", children: props.areas } ],
              sort: false,
          } )
        }
    },

    selectItem( col, item ) {
        var selection = this.state.selection;
        selection[ col ] = item;
        selection.length = col + 1;
        this.setState( {
            selection: selection
        } );
    },

    addItem( col ) {
        var selection = this.state.selection;
        if ( !selection[ col ] ) {
            selection[ col ] = { name: "Unknown", children: [] }
        }
        if ( !selection[ col ].children ) {
            selection[ col ].children = [];
        }
        var lastIndex = selection[ col ].children.length - 1;
        var lastItem = selection[ col ].children[ lastIndex ];
        if ( !lastItem || lastItem.name.length ) {
            selection[ col ].children.push( { name: "", children: [] } );
        }
        this.setState( {
            selection: selection
        }, () => {
          let selectorID = ""
          switch (col) {
            case 0: {
              selectorID = '#area-';
              break;
            }
            case 1: {
              selectorID = '#subarea-';
              break;
            }
            case 2: {
              selectorID = '#identity-';
              break;
            }
          }
          $("input"+ selectorID +(selection[ col ].children.length - 1 )).click();
          $("input"+ selectorID + (selection[ col ].children.length - 1 )).focus();
        } );
        this.save();
    },

    removeItem( col, idx ) {
        var selection = this.state.selection;
        selection.length = col + 1;
        selection[ col ].children.splice( idx, 1 );
        this.setState( {
            selection: selection
        } );
        this.save();
        Modal.hide();
    },

    updateItem( col, idx, event ) {
        var value = event.target.value;
        var selection = this.state.selection;
        selection[ col ].children[ idx ].name = value;
        this.setState( {
            selection: selection
        } );
        this.save();
    },

    save( _component ) {
        var facility = this.state.facility;
        var selection = this.state.selection;
        var areas = selection[ 0 ].children;
        facility.setAreas( areas );
    },
    componentDidUpdate(){
      _component = this
    },
    componentDidMount() {
      /*$("#sortableLevel, #sortableArea, #sortableSubarea").sortable({
        stop: function(event, ui) {
          let selected = ui.item.attr("id").split("-"),
            heightOfSelectedElement = ui.item.height(),// Height of the selected element i.e. <LI>.
            selectedCol = selected[0], // Selected col.
            startIndex = parseInt(selected[1]), // Row number of the selected col.
            dropPosition = ui.position.top,//Position w.r.t. parent element i.e. <UL>
            col = selectedCol === "area"? _areas: ( selectedCol === "subarea"? _selectedArea : _selectedSubArea ),
            stopIndex = parseInt( dropPosition/heightOfSelectedElement ),
            temp = null;
            temp = col[startIndex];
            //sort Top-Dowm
            if ( startIndex < stopIndex ) {
              for(var i = startIndex; i <= stopIndex; i++) {
                col[i] = col[i+1];
              }
              col[stopIndex] = temp;
            }
            //sort Bottom-UP
            if ( startIndex > stopIndex && stopIndex > 0 ) {
              for(var i = startIndex; i >= stopIndex; i--) {
                col[i] = col[i-1];
              }
              col[stopIndex] = temp;
            }
            _component.setState({
              selection: _component.state.selection,
              sort: true,
            })
            _component.save();
        },
        placeholder: "ui-state-highlight",
      });
      $( "#sortable" ).disableSelection();
      $( '.areas-selector .slimscroll' ).slimScroll( {
          height: '504px'
      } );*/
      this.save = _.debounce( this.save, 1000 );
    },

    handleKeyDown( event, colAdd, colSelect, element, row ){
      if ( event.keyCode == 13 ) {
        let len = element.length - 1 ;
        if ( row == len ) {
          (this.addItem.bind(this,colAdd)());
        } else {
          (this.selectItem.bind(this,colSelect,element[row+1])());
          let selectorID = ""
          switch (colAdd) {
            case 0: {
              selectorID = '#area-';
              break;
            }
            case 1: {
              selectorID = '#subarea-';
              break;
            }
            case 2: {
              selectorID = '#identity-';
              break;
            }
          }
          $("input"+ selectorID +(row+1)).click();
          $("input"+ selectorID +(row+1)).focus();
        }
      }
    },

    render() {
        //refact - create a FacilityAreaSelectorRow class nad use that in these three instances below
        var component = this;
        var facility = this.state.facility;
        var selection = this.state.selection;

        var areas = selection[ 0 ].children || [];
        var editable = !facility || facility.canSetAreas();

        var selectedArea = selection[ 1 ] || {};

        var selectedSubArea = selection[ 2 ] || {};
        _component = this;
        _areas = areas;
        _selectedArea = selectedArea.children;
        _selectedSubArea = selectedSubArea.children;
        return (
            <div className="areas-selector">
                <div className="areas-selector-col">
                    <div className="areas-selector-row areas-selector-row-header">Level</div>
                    <div className="slimscroll">
                      <ul>
                        {
                            areas.map(function(a,idx){
                              a.data = a.data?a.data:{};
                                return (
                                  <li key={idx} id={"area-"+idx} className={"ui-state-default areas-selector-row-li"+(selectedArea.name==a.name?" active":"")}>
                                    <div className="row">
                                      <div className="col-xs-12">
                                        <div className={"areas-selector-row"+(selectedArea.name==a.name?" active":"")}>
                                            <input
                                                id={"area-"+idx}
                                                onClick={component.selectItem.bind(component,1,a)}
                                                value={a.name||undefined}
                                                readOnly={!editable}
                                                onChange={component.updateItem.bind(component,0,idx)}
                                                onBlur={()=>{
                                                    if(_.isEmpty(a.name)){
                                                        component.removeItem(0,idx)
                                                    }
                                                    component.props.sortArea(component.state.selection[0].children)
                                                }}
                                                onKeyDown={ event => component.handleKeyDown( event, 0, 1, areas, idx ) }
                                            />
                                            {editable?<span className="areas-selector-delete-icon"
                                              onClick = {
                                                () => {
                                                  Modal.show({
                                                    content:  <div style={{padding:'20px'}}>
                                                      <div>
                                                        <h1>Area information: {a.name||""} </h1>
                                                      </div>
                                                      <AutoForm
                                                        model = { Facilities }
                                                        item = { a.data }
                                                        form = { ["areaDetails"] }
                                                        onSubmit={
                                                            ( item ) => {
                                                                let readyToSave = false;
                                                                    readyToSave = _.isEmpty(item.areaDetails.daySelector) ? false : true;
                                                                if(readyToSave){
                                                                    readyToSave = false;
                                                                    if(!_.isEmpty(item.areaDetails.daySelector.Mon.time) || !_.isEmpty(item.areaDetails.daySelector.Tue.time) || !_.isEmpty(item.areaDetails.daySelector.Wed.time) || !_.isEmpty(item.areaDetails.daySelector.Thu.time) || !_.isEmpty(item.areaDetails.daySelector.Fri.time) || !_.isEmpty(item.areaDetails.daySelector.Sat.time) || !_.isEmpty(item.areaDetails.daySelector.Sun.time) ){
                                                                        readyToSave = true;
                                                                    }
                                                                }
                                                                if(readyToSave){
                                                                    component.save();
                                                                    Modal.hide();
                                                                }else{
                                                                    Bert.alert({
                                            			  				title: 'Operation not allowed',
                                            			  				message: "Please set the booking time for at least 1 day",
                                            			  				type: 'danger',
                                            			  				style: 'growl-top-right',
                                            			  				icon: 'fa-ban'
                                            						});
                                                                }
                                                            }
                                                        }
                                                      />
                                                      <div style={ {textAlign:"right", clear:"both"}}>
                                                        {editable ? <button style={{float:"left", color: "red", position:"relative",top:"-43px"}} className="btn btn-flat btn-primary" onClick={component.removeItem.bind(component,0,idx)}> Delete</button>:null}
                                                      </div>
                                                    </div>
                                                  })
                                                } } ><i title="Configure Level" className="fa fa-cogs" aria-hidden="true"></i></span>:null}
                                              {/*editable?<span title="Remove Level" className="areas-selector-delete-icon" style={{right: "10px", fontSize: "20px"}} onClick={component.removeItem.bind(component,0,idx)}>&times;</span>:null*/}
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                )
                            })
                        }
                      </ul>
                        {editable?
                          <div onClick={component.addItem.bind(component,0)} className="areas-selector-row">
                              <span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
                              <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
                          </div>:
                         null}
                    </div>
                </div>
                <div className="areas-selector-col">
                    <div className="areas-selector-row areas-selector-row-header">Area</div>
                    <div className="slimscroll">
                        <ul>
                          {
                              selectedArea&&selectedArea.children?selectedArea.children.map(function(b,idx){
                                b.data = b.data?b.data:{};
                                  return (
                                    <li key={idx} id={"subarea-"+idx} className={"ui-state-default areas-selector-row-li"+(selectedSubArea.name==b.name?" active":"")}>
                                      <div className="row">
                                        <div className="col-xs-12">
                                          <div key={idx} className={"areas-selector-row"+(selectedSubArea.name==b.name?" active":"")}>
                                            <input
                                              id={"subarea-"+idx}
                                              onClick={component.selectItem.bind(component,2,b)}
                                              value={b.name||undefined}
                                              readOnly={!editable}
                                              onChange={component.updateItem.bind(component,1,idx)}
                                              onBlur={()=>{
                                                  if(_.isEmpty(b.name)){
                                                      component.removeItem(1,idx)
                                                  }
                                                  component.props.sortArea(component.state.selection[0].children)
                                              }}
                                              onKeyDown={ event => component.handleKeyDown( event, 1, 2, selectedArea.children, idx ) }/>
                                            {editable?<span className="areas-selector-delete-icon"
                                              //onClick={component.removeItem.bind(component,1,idx)}
                                              onClick = {
                                                () => {
                                                  Modal.show({
                                                    content:  <div style={{padding:'20px'}}>
                                                    <div>
                                                      <h1>Area information: {b.name}</h1>
                                                    </div>
                                                    <AutoForm
                                                      model = { Facilities }
                                                      item = { b.data }
                                                      form = { ["areaDetails"] }
                                                      onSubmit={
                                                        ( item ) => {
                                                          component.save();
                                                          Modal.hide();
                                                        }
                                                      }
                                                      />
                                                      {editable ? <button style={{float:"left", color: "red", position:"relative",top:"-43px"}} className="btn btn-flat btn-primary" onClick={component.removeItem.bind(component,1,idx)}> Delete</button>:null}
                                                  </div>
                                                })
                                              } } ><i title="Configure Area"className="fa fa-cogs" aria-hidden="true"></i></span>:null}
                                              {/*editable?<span title="Remove Area" className="areas-selector-delete-icon" style={{right: "10px", fontSize: "20px"}} onClick={component.removeItem.bind(component,1,idx)}>&times;</span>:null*/}
                                            </div>
                                        </div>
                                      </div>
                                    </li>
                                  )
                              }):null
                          }
                        </ul>
                    {editable&&selection[1]?
                    <div onClick={component.addItem.bind(component,1)} className="areas-selector-row">
                        <span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
                        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
                    </div>
                    :null}
                    </div>
                </div>
                <div className="areas-selector-col">
                    <div className="areas-selector-row areas-selector-row-header">Subarea</div>
                    <div className="slimscroll">
                      <ul>
                        {
                            selectedSubArea&&selectedSubArea.children?selectedSubArea.children.map(function(c,idx){
                              c.data = c.data?c.data:{};
                              return (
                                <li key={idx} id={"identity-"+idx} className={"ui-state-default areas-selector-row-li"+(selectedArea.name==c.name?" active":"")}>
                                  <div className="row">
                                    <div className="col-xs-12">
                                      <div key={idx} className={"areas-selector-row"+(selectedArea.name==c.name?" active":"")}>
                                        <input
                                          id={"identity-"+idx}
                                          onClick={component.selectItem.bind(component,3,c)}
                                          value={c.name||undefined}
                                          readOnly={!editable}
                                          onChange={component.updateItem.bind(component,2,idx)}
                                          onBlur={()=>{
                                              if(_.isEmpty(c.name)){
                                                  component.removeItem(2,idx)
                                              }
                                              component.props.sortArea(component.state.selection[0].children)
                                          }}
                                          onKeyDown={  event  => component.handleKeyDown( event, 2, 3, selectedSubArea.children, idx ) }
                                          />
                                        {editable?<span className="areas-selector-delete-icon"
                                          //onClick={component.removeItem.bind(component,2,idx)}
                                          onClick = {
                                            () => {
                                              Modal.show({
                                                content:  <div style={{padding:'20px'}}>
                                                <div>
                                                  <h1>Area information: {c.name}</h1>
                                                </div>
                                                <AutoForm
                                                  model = { Facilities }
                                                  item = { c.data }
                                                  form = { ["areaDetails"] }
                                                  onSubmit={
                                                    ( item ) => {
                                                      component.save();
                                                      Modal.hide();
                                                    }
                                                  }
                                                  />
                                                  {editable ? <button style={{float:"left", color: "red", position:"relative",top:"-43px"}} className="btn btn-flat btn-primary" onClick={component.removeItem.bind(component,2,idx)}> Delete</button>:null}
                                              </div>
                                            })
                                            //  component.removeItem.bind(component,0,idx)
                                          } } ><i title="Configure Subarea" className="fa fa-cogs" aria-hidden="true"></i></span>:null}
                                          {/*editable?<span title="Remove Subarea" className="areas-selector-delete-icon" style={{right: "10px", fontSize: "20px"}} onClick={component.removeItem.bind(component,2,idx)}>&times;</span>:null*/}
                                        </div>
                                    </div>
                                  </div>
                                </li>
                                )
                            }):null
                        }
                    </ul>
                    {editable&&selection[2]?
                    <div onClick={component.addItem.bind(component,2)} className="areas-selector-row">
                        <span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
                        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
                    </div>
                    :null}
                    </div>
                </div>
            </div>
        )
    }

} )

export default AreasEditor;
