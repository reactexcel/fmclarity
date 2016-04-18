FilterBox2 = React.createClass({

	componentDidMount() {
	    this.applyFilter();
	},

	getInitialState() {
    return {
    	selectedFilterNum:0,
    	selectedItem:this.props.items?this.props.items[0]:null
    }
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

  applyFilter(items) {
    var filters = this.props.filters;
    if(filters) {
    	var filter = this.props.filters[this.state.selectedFilterNum].filter;
      if(filter) {
		    items = _.filter(items,filter);
      }
    }
    if(items&&items.length) {
      items = items.sort(function(a,b){
        return a.getName()<b.getName()?-1:1;
      });
    }
    return items;
  },

  setFilter(filterNum) {
    this.setState({
      selectedFilterNum:filterNum
    })
  },

  createNewItem() {
    var component = this;
    component.setFilter(0);
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
    var $this = this;
    var title = $this.props.title;
    var filters = $this.props.filters;

    var selectedFilterNum = this.state.selectedFilterNum;
    var initialItems = this.props.items;


    var items = this.applyFilter(initialItems);


    var numCols = parseInt(this.props.numCols) || 1;
    var colSize = Math.floor(12 / numCols);

    var newItemCallback = this.props.newItemCallback;

    var Header = $this.props.itemView.header;

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
    <div className="row">
      	<div className="col-lg-6 sm-gutter-right-5px">
        	<div className="filter-box-2 ibox">
        		<div className="ibox-title">
                {this.props.newItemCallback==null?null:
              		<button onClick={this.createNewItem} className="card-button new-card-button pull-right">+</button>
                }
            		{title?<h5>{title}</h5>:null}
            		{!filters?null:
            			<ol id="filters" className="breadcrumb" style={{backgroundColor:"transparent",padding:"15px 0 15px 20px"}}>
              			{filters.map(function(i,index){
                			return (
                  				<li key={index} className={selectedFilterNum==index?'active':''}>
                    				<a onClick={$this.setFilter.bind(null,index)}>{i.text}</a>
                  				</li>
                			)
              			})}
            			</ol>}
            		{!Header?null:<Header item={items[0]} />}
          		</div>
	          	<div className="ibox-content" style={{paddingBottom:0,paddingTop:0}}>
		            <div className="row isotope">
		              	{items.map(function(i,index){
                      if(i.sticky||i.isNewItem)
		                	return (
		                  		<div 
		                    		key={i._id}
		                    		style={{padding:0}}
		                    		className={"table-row col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
		                  		>
			                    	<CardHeaderWrapper
			                      		item={i}
			                      		view={$this.props.itemView.summary}
			                      		toggle={$this.selectItem.bind($this,i)}
			                      		isSelected={$this.state.selectedItem&&$this.state.selectedItem._id==i._id}
			                    	/>
		                  		</div>	
	                	)
		              	})}
                    {items.map(function(i,index){
                      if(!(i.sticky||i.isNewItem))
                      return (
                          <div 
                            key={i._id}
                            style={{padding:0}}
                            className={"table-row col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
                          >
                            <CardHeaderWrapper
                                item={i}
                                view={$this.props.itemView.summary}
                                toggle={$this.selectItem.bind($this,i)}
                                isSelected={$this.state.selectedItem&&$this.state.selectedItem._id==i._id}
                            />
                          </div>  
                    )
                    })}
		            </div>
	        	</div>
    		</div>
    	</div>
    	<div className="col-lg-6">
    				{selectedItem?
			        <CardBodyWrapper
			            item={selectedItem}
			            view={this.props.itemView.detail}
			        />
			        :null}
    	</div>
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

CardWrapper2 = React.createClass({


  	toggle() {
    	this.setState({shouldExpand:!this.state.shouldExpand});
  	},

  	shouldComponentUpdate() {
    	if(this.isAnimating) {
      		return false;
    	}
    	return true;
  	},

  	componentWillMount() {
    	this.isAnimating = false;
    	if(this.props.item.isNewItem) {
      		this.setState({
        		shouldExpand:true
      		});
    	}
  	},

  	componentWillReceiveProps() {
    	if(this.props.item.isNewItem) {
      		this.setState({
        	shouldExpand:true
      	});
    	}
  	},

  	componentDidUpdate () {
    	if(!this.state.didExpand&&this.state.shouldExpand) {
      		this.expand();
    	}
    	else if(this.state.didExpand&&!this.state.shouldExpand) {
      		this.contract();
    	}
  	},

  	render() {
	    var $this = this;
	    var item = this.item = this.props.item;
	    var Summary = this.props.itemView.summary;
	    var Detail = this.props.itemView.detail;
	    return (
	    <div className={
		        (item.isNewItem?"new-grid-item diminished ":'')+
		        (this.state.didExpand?"gigante ":'')+
		        "grid-item"
		    }
	    >
	    	<CardHeaderWrapper 
	    		item={this.item}
	    		view={this.props.itemView.summary}
	    		toggle={this.toggle} 
	    		shouldExpand={this.state.shouldExpand}
	    	/>
	        {Detail&&(this.state.shouldExpand||this.state.didExpand)?
	        <CardBodyWrapper
	        	item={this.item}
	        	view={this.props.itemView.detail}
	        	toggle={this.toggle}
	        	shouldExpand={this.state.shouldExpand}
        	/>
			:null}
	    </div>
    )}
});