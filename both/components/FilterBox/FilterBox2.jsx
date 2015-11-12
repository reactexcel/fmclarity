FilterBox2 = React.createClass({

	componentDidMount() {
	   	this.title = this.props.title;
	    this.card = this.props.card;
	    this.items = this.props.items;
	    this.applyFilter();
	},

	getInitialState() {
    	return {
    		selectedFilterNum:0,
    		selectedItem:this.props.items[0]
    	}
  	},

  	applyFilter(items) {
    	var filters = this.props.filters;
    	if(filters) {
    	  	var filter = this.props.filters[this.state.selectedFilterNum].filter;
      		if(filter) {
		        return _.filter(items,filter);
      		}
    	}
    	return items;
  	},

  	setFilter(filterNum) {
	    this.setState({
      		selectedFilterNum:filterNum
    	})
  	},

  	createNewItem() {
    	this.setFilter(0);
    	this.props.newItemCallback();
  	},

  	toggle() {
  		var $this = this;
  		return function(item) {
	  		$this.setState({
	  			selectedItem:item
	  		});
	  	}
  	},

	render() {
    var $this = this;
    var title = $this.props.title;
    var filters = $this.props.filters;

    var selectedFilterNum = $this.state.selectedFilterNum;
    var initialItems = $this.props.items;
    var items = $this.applyFilter(initialItems);
    var numCols = parseInt(this.props.numCols) || 1;
    var colSize = Math.floor(12 / numCols);

    var newItemCallback = this.props.newItemCallback;

    var Header = $this.props.itemView.header;

    if(!items) {
    	return <div/>
    }
    return (
    <div className="row">
      	<div className="col-lg-6">
        	<div className="filter-box-2 ibox">
        		<div className="ibox-title">
            		<button 
              			onClick={this.createNewItem} 
              			className="card-button new-card-button pull-right"
            		>+</button>
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
		                	return (
		                  		<div 
		                    		key={i._id}
		                    		style={{padding:0}}
		                    		className={"table-row col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
		                  		>
			                    	<CardHeaderWrapper
			                      		item={i}
			                      		view={$this.props.itemView.summary}
			                      		toggle={$this.toggle()}
			                      		isSelected={$this.state.selectedItem==i}
			                    	/>
		                  		</div>	
	                	)
		              	})}
		            </div>
	        	</div>
    		</div>
    	</div>
    	<div className="col-lg-6" style={{paddingLeft:"5px"}}>
    		<div className="filter-box-2-detail-pane ibox">
    			<div className="ibox-content">
    				{this.state.selectedItem?
			        <CardBodyWrapper
			            item={this.state.selectedItem}
			            view={this.props.itemView.detail}
			        />
			        :null}
    			</div>
    		</div>
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
		this.item = this.props.item;
		return (
	        <div className="card-body">
	          	<View item={this.item}/>
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