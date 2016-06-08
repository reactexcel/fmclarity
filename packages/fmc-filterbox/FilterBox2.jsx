import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FilterBox2 = React.createClass({

	componentDidMount() {
    this.checkScreenSize();
    $(window).bind("resize", this.checkScreenSize);
	},

	getInitialState() {
    return {
    	selectedItem:this.props.items?this.props.items[0]:null,
      screenSize:"sm"
    }
  },

  checkScreenSize() {
    var size = "sm";
    if (window.matchMedia('(min-width: 1200px)').matches) {
      size = "lg";
    } 
    this.setState({
      screenSize:size
    })
  },

  componentWillReceiveProps(newProps) {
    if(this.state.selectedItem) {
      //check to see if existing selected item is in the new set
      if(newProps.items&&newProps.items.length) { 
        for(var i in newProps.items) {
          var newItem = newProps.items[i];
          //if it is... we'll just keep it selected
          if(newItem&&newItem._id&&newItem._id==this.state.selectedItem._id) {
            return;
          }
        }
      }
      //if it isn't, we'll reset the selected item
      this.setState({
        selectedItem:newProps.items?newProps.items[0]:null
      })
    }
  },

  createNewItem() {
    var component = this;
    if(this.props.newItemCallback) {
      this.props.newItemCallback(function(newItem){
        component.setState({
          selectedItem:newItem
        });
      });
    }
  },

  selectItem(item) {
	  this.setState({
	  	selectedItem:item
	  });
  },

	render() {
    var component = this;
    var items = this.props.items;
    var numCols = parseInt(this.props.numCols) || 1;
    var navWidth = parseInt(this.props.navWidth) || 6;
    var bodyWidth = parseInt(12-navWidth);
    var colSize = Math.floor(12 / numCols);
    var newItemCallback = this.props.newItemCallback;
    var Header = component.props.itemView.header;
    var selectedItem;

    for(var i in this.props.items) {
      var item = this.props.items[i];
      if(item&&this.state.selectedItem&&item._id==this.state.selectedItem._id) {
        selectedItem = item;
      }
    }

    if(!items) {
    	return <div/>
    }
    return (
    <div className="filter-box-2">
      <div className="row">
        {!selectedItem||this.state.screenSize=="lg"?
        <div className={"col-lg-"+navWidth+" lg-gutter-right-5px"}>
          <div className="row">
            {items.map(function(i,index){
              return (
                <div 
                  key={i._id}
                  className={"col-lg-"+colSize+" col-sm-12"}
                >
                  <CardHeaderWrapper
                    item={i}
                    view={component.props.itemView.summary}
                    toggle={component.selectItem.bind(component,i)}
                    isSelected={component.state.selectedItem&&component.state.selectedItem._id==i._id}
                  />
                </div>  
              )
            })}
  		    </div>
      	</div>
        :null}
        {selectedItem||this.state.screenSize=="lg"?
        <div className={"col-lg-"+bodyWidth}>
      		{selectedItem?
            <CardBodyWrapper
              item={selectedItem}
              view={this.props.itemView.detail}
            />
          :null}
          {this.state.screenSize!="lg"?
            <div onClick={this.selectItem.bind(this,null)} style={{
              position:"absolute",
              left:"32px",
              top:"10px",
              color:"#888",
              fontSize:"24px",
              cursor:"pointer"
            }}>
              <i className="fa fa-chevron-circle-left"></i>
            </div>
          :null}
      	</div>
        :null}
      </div>
      {this.props.newItemCallback==null?null:
        <button 
          onClick={this.createNewItem} 
          className="card-button new-card-button pull-right" 
        >+</button>
      }
    </div>
    )
	}
});

CardHeaderWrapper = React.createClass({
	componentWillMount() {
		this.toggle = this.props.toggle;
	},
	render() {
		var View = this.props.view;
		var item = this.props.item;
		var isSelected = this.props.isSelected;
		return (
			<div className={"grid-item"+(isSelected?" active":"")}>
        <div className="card-header" onClick={this.toggle.bind(null,item)}>
          <div className="card-header-summary">
            <View item={item} />
          </div>
        </div>
      </div>
		)
	}
})

CardBodyWrapper = React.createClass({
	render() {
		var View = this.props.view;
		return (
	        <div className="card-body ibox">
	          	<View item={this.props.item}/>
	        </div>
	    )
	}
})