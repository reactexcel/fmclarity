import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

// FilterBox2
//
// A variation on the 1 column filterbox which includes a left navigation bar
// and a right content section with a large detail view of the selected component
//
// PROPS
//
// items (array)
//      the collection of items to render
//
// navWidth (int)
//      the witch (in bootstrap cols) to make the left nav
//
// itemView (object)
//      structure including the components to be used for rendering the view
//      {
//        summary: the component used to render the left nav items
//        detail: the component used to render the main content
//      }
//
// newItemCallback (function)
//      A callback function to be invoked when the FAB new button is pushed
//      REFACT: onCreateNew would be a more idiomatic name for this callback
//
// onSelect (function)
//      A callback invoked when an item is select in the left navigation bar
//
FilterBox2 = React.createClass({

  // the state for this component includes the currently selected item
  // and a dynamic flag for the screen size
	getInitialState() {
    return {
    	selectedItem:this.props.items?this.props.items[0]:null,
      screenSize:"sm"
    }
  },

  // gives us dynamic information about screen size...
  // so we can switch components responsively using react
  // - suggest moving this functionality to another package
  checkScreenSize() {
    var size = "sm";
    if (window.matchMedia('(min-width: 1200px)').matches) {
      size = "lg";
    } 
    this.setState({
      screenSize:size
    })
  },

  componentDidMount() {
    this.checkScreenSize();
    $(window).bind("resize", this.checkScreenSize);
  },

  componentWillReceiveProps(newProps) {
    //check to see if existing selected item is in the new set
    //if it is... we'll just keep it selected
    if(this.state.selectedItem) {
      if(newProps.items&&newProps.items.length) { 
        for(var i in newProps.items) {
          var newItem = newProps.items[i];
          if(newItem&&newItem.name&&newItem.name==this.state.selectedItem.name) {
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

  // called when the FAB new button is pushed
  // calls the provided newItemCallback and updates the state with the newly created item
  // this will also go to another package
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
    //console.log(item);
	  this.setState({
	  	selectedItem:item
	  });
    if(this.props.onSelect) {
      this.props.onSelect(item);
    }
  },

	render() {
    var items = this.props.items;
    var numCols = parseInt(this.props.numCols) || 1;
    var navWidth = parseInt(this.props.navWidth) || 6;
    var bodyWidth = parseInt(12-navWidth);
    var colSize = Math.floor(12 / numCols);
    var newItemCallback = this.props.newItemCallback;
    var Header = this.props.itemView.header;
    var selectedItem;

    if(!items) {
      return <div/>
    }
    else if(items.length==1) {
      selectedItem = items[0];
    }
    else {
      for(var i in this.props.items) {
        var item = this.props.items[i];
        if(item&&this.state.selectedItem&&item.name==this.state.selectedItem.name) {
          selectedItem = item;
        }
      }
    }
    return (
    <div className="filter-box-2">
      <div className="row">
        {!selectedItem||(this.state.screenSize=="lg"&&items.length>1)?
        <div className={"col-lg-"+navWidth+" lg-gutter-right-5px"}>
          <div className="row">
            {items.map((i,idx)=>{
              return (
                <div 
                  key={i._id||idx}
                  className={"col-lg-"+colSize+" col-sm-12"}
                >
                  <FilterBox2LeftNavItem
                    item={i}
                    view={this.props.itemView.summary}
                    toggle={this.selectItem.bind(this,i)}
                    isSelected={this.state.selectedItem&&this.state.selectedItem.name==i.name}
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
            <FilterBox2SelectedDetailView
              item={selectedItem}
              view={this.props.itemView.detail}/>
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
    </div>
    )
	}
});

FilterBox2LeftNavItem = React.createClass({
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

// FilterBox2SelectedDetailView
// Simply renders the view passed into the props
FilterBox2SelectedDetailView = React.createClass({
	render() {
		var View = this.props.view;
		return (
	        <div className="card-body ibox">
	          	<View item={this.props.item}/>
	        </div>
	    )
	}
})