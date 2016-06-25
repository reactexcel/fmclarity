import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FilterBox = React.createClass({

	componentDidMount() {
    this.title = this.props.title;
    this.card = this.props.card;
    this.items = this.props.items;
    this.applyFilter();
    //$("#page-wrapper").on('click',this.toggleExpandedItem);
	},

  getInitialState() {
    return {
      expandedItem:null,
      selectedFilterNum:0,
      selectedSortNum:null,
      sortDirection:1
    }
  },

  itemIsSticky(item) {
    return item.isSticky?item.isSticky():null;
  },

  applyFilter(items) {
    var filters = this.props.filters;
    var filteredItems = items;
    if(items&&filters) {
      var filter = filters[this.state.selectedFilterNum].filter;
      if(filter) {
        filteredItems = [];
        for(var i in items) {
          var item = items[i];
          if(item.sticky||filter(item)) {
            filteredItems.push(item);
          }
        }
      }
    }
    return filteredItems;
  },

  applySort(items) {
    var headers = this.props.headers;
    var component = this;
    if(items&&headers) {
      items.sort(function(a,b){
        return a.createdAt - b.createdAt;
      })
      var sortNum,f,modifier;
      sortNum = this.state.selectedSortNum;
      if(sortNum!=null) {
        f = headers[this.state.selectedSortNum].sortFunction;
        modifier = this.state.sortDirection;
      }
      return items.sort(function(a,b) {
        if(a.isNew()) {
          return -1
        }
        else if(b.isNew()) {
          return 1;
        }
        else if(component.itemIsSticky(a)&&component.itemIsSticky(b)) {
          if(f) {
            return f(a,b)*modifier;
          }
          else {
            if(a.createdAt>b.createdAt) {
              return -1;
            }
            return 1;
          }
        }
        else if(component.itemIsSticky(a)) {
          return -1
        }
        else if(component.itemIsSticky(b)) {
          return 1;
        }
        else if(f) {
          return f(a,b)*modifier;
        }
        else {
          if(a.createdAt>b.createdAt) {
            return -1;
          }
          return 1;
        }
      });
    }
    return items;
  },

  setFilter(filterNum) {
    this.setState({
      selectedFilterNum:filterNum
    });
    this.toggleExpandedItem();
  },

  setSort(sortNum) {
    var direction;
    /*console.log({
      sortNum:sortNum,
      newSortNum:this.state.selectedSortNum,
      sortDirection:this.state.sortDirection,
    });*/
    if(sortNum==this.state.selectedSortNum) {
      direction = this.state.sortDirection*=-1;
    }
    else {
      direction = 1;
    }
    this.setState({
      selectedSortNum:sortNum,
      sortDirection:direction
    })
    this.toggleExpandedItem();
  },

  createNewItem() {
    var component = this;
    this.props.newItemCallback(function(newItem){
      if(newItem) {
        component.toggleExpandedItem(newItem);
      }
    });
  },

  toggleExpandedItem(item,callback) {
    //console.log({'got here':item});
    var expandedItem,isExpanded;
    if(
      !item||
      (this.state.expandedItem&&this.state.expandedItem._id==item._id)
    ) 
    {
      expandedItem = null;
      isExpanded = false;
    }
    else {
      expandedItem = item;
      isExpanded = true;
    }
    this.setState({
      expandedItem:expandedItem
    });
    if(callback) {
      callback(isExpanded);
    }
  },

	render() {
    var $this = this;
    var title = $this.props.title;
    var filters = $this.props.filters;
    var headers = this.props.headers;

    var selectedFilterNum = $this.state.selectedFilterNum;
    var selectedSortNum = this.state.selectedSortNum;
    var sortDirection = this.state.sortDirection;

    var initialItems = $this.props.items;
    var items = $this.applyFilter(initialItems);
    items = $this.applySort(items);

    var numCols = parseInt(this.props.numCols) || 1;
    var colSize = Math.floor(12 / numCols);

    var newItemCallback = this.props.newItemCallback;

    var Header = $this.props.itemView.header;

    if(!items) {
      return <div/>
    }

    return (
      <div>
        <div className="filter-box ibox">
          <div className="ibox-title">
            <button title="Export requests"
              onClick={this.props.exportCallback?this.props.exportCallback.bind(null,items):null} 
              className="card-button fab-button-2"
              style={{backgroundColor:"transparent",color:"#333"}}
            ><i className="fa fa-download"></i></button>
            {this.props.newItemCallback==null?null:
              <button 
                onClick={this.createNewItem} 
                className="card-button new-card-button pull-right"
              >+</button>
            }
            {title?<h5>{title}</h5>:null}

            {!filters?null:

            <ol id="filters" className="breadcrumb" style={{backgroundColor:"transparent",padding:"15px 0 15px 20px"}}>
              {filters.map(function(i,index){
                return (
                  <li key={index} className={selectedFilterNum==index?'active':''}>
                    <a onClick={$this.setFilter.bind($this,index)}>{i.text}</a>
                  </li>
                )
              })}
            </ol>

            }

            {!headers?null:
              <div className="card-table-header issue-card-table-header">
              {headers.map(function(i,index){
                return (
                  <div 
                    key={index}
                    onClick={$this.setSort.bind(null,index)} 
                    style={{color:(index==selectedSortNum)?'#000':'#999'}}  
                    className={"issue-summary-col issue-summary-col-"+(index+1)}
                  >
                    <div>{i.text}</div>
                    {index==selectedSortNum?
                      <div style={{paddingLeft:"14px",position:"relative",top:"-10px",fontSize:"20px"}}>
                        <i className={"fa fa-caret-"+(sortDirection==1?"down":"up")}></i>
                      </div>
                      :null
                    }                    
                  </div>
                )
              })}
              </div>
            }

          </div>
          <div className="ibox-content" style={{paddingBottom:0,paddingTop:0}}>
            <div className="row isotope">
              {items.map(function(item,index){
                return (
                  <div 
                    key={item._id}
                    style={{padding:0}}
                    className={"col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
                  >
                    <CardWrapper 
                      item={item}
                      expanded={$this.state.expandedItem&&($this.state.expandedItem._id==item._id)}
                      toggleSize={$this.toggleExpandedItem}
                      itemView={$this.props.itemView}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
});

CardWrapper = React.createClass({

  getInitialState() {
    return {
      collapsed:!this.props.expanded
    }
  },

  componentWillReceiveProps(newProps) {
    this.setState({
      collapsed:!newProps.expanded
    });
  },

  toggle() {
    var component, item, toggleSize;
    container = this.refs.container;
    item = this.props.item;
    toggleSize = this.props.toggleSize;
    if(toggleSize) {
      toggleSize(item,function(expanded){
        /*if(expanded) {
          $('html, body').animate({
              scrollTop: $(container).offset().top-60
          }, 750, 'easeInOutQuart');        
        }*/
      })
    }
  },

  toggleSticky() {
    this.item.sticky = this.item.sticky?false:true;
    this.item.save();
  },

  itemIsSticky(item) {
    return item.isSticky?item.isSticky():null;
  },

  render() {
    var $this = this;
    var item = this.item = this.props.item;
    var owner = this.item.getOwner?this.item.getOwner():{};
    var Summary = this.props.itemView.summary;
    var Detail = this.props.itemView.detail;
    var sticky = this.itemIsSticky(item);
    return (
      <div 
        ref="container"
        className={
          (!this.state.collapsed?"gigante ":'')+
          "grid-item"
        }
      >
        <div className="card-header">
          <div className="card-header-right-toolbar">
            {/*
            <div
              style={{padding:"10px 5px 7px 13px",fontSize:"20px",opacity:sticky?1:0.1,color:(sticky=="Sticky"?"blue":sticky?"red":"#000")}}
              onClick={this.toggleSticky}
              className="grid-item-select-button"
            >
              <i title={sticky} className={"fa "+(sticky=="Sticky"||!sticky?"fa-thumb-tack":sticky=="Overdue"?"fa-clock-o":"fa-exclamation-triangle")}></i>
            </div>
            */}
          </div>
          <div className="card-header-summary" onClick={this.toggle}>
            <Summary item={item} />
          </div>
        </div>
      {Detail&&(!this.state.collapsed)?
        <div className="card-body">
          <Detail item={item} closeCallback={this.toggle}/>
        </div>:null}
      </div>
    )
  }
});