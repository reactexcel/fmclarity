FilterBox = React.createClass({

	componentDidMount() {
    this.title = this.props.title;
    this.card = this.props.card;
    this.items = this.props.items;
    this.applyFilter();
	},

  getInitialState() {
    return {
      selectedFilterNum:0
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

    return (
      <div>
        <div className="filter-box ibox">
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
                    className={"col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
                  >
                    <CardWrapper 
                      item={i}
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
    var item = this.props.item;
    return {
      shouldExpand:item.isNewItem?true:false,
      didExpand:false
    }
  },

  deleteItem() {
    var dom = $(React.findDOMNode(this));
    var parent = dom.closest('.grid-item');
    var $scope = this;
    parent.toggleClass('diminished gigante',250,function(){
      $scope.item.destroy();
      //Meteor.call("Issue.destroy",$scope.facility);
    });
  },    

  expand() {
    var $this = this;
    if(!$this.state.didExpand) {
      var i = $(React.findDOMNode($this));
      i.addClass('pre-gigante');
      i.toggleClass('gigante',250,function(){
        i.removeClass('diminished pre-gigante');
        $this.setState({didExpand:true});
      });
    }
  },

  contract() {
    var $this = this;
    if($this.state.didExpand) {
      var i = $(React.findDOMNode($this));
      i.toggleClass('gigante',250,function(){
        $this.setState({didExpand:false})
        if($this.item.isNewItem) {
          $this.item.destroy();
        }
      });
    }
  },

  toggle() {
    this.setState({shouldExpand:!this.state.shouldExpand});
  },

  componentDidUpdate () {
    if(this.state.shouldExpand) {
      this.expand();
    }
    else if(!this.state.shouldExpand) {
      this.contract();
    }
  },

  render() {
    var $this = this;
    var item = this.item = this.props.item;
    var Summary = this.props.itemView.summary;
    var Detail = this.props.itemView.detail;
    return (
      <div 
        className={
          (item.isNewItem?"new-grid-item diminished ":'')+
          (this.state.didExpand?"gigante ":'')+
          "grid-item"
        }
      >
        <div className="card-header" onClick={this.toggle}>
          <div className="card-header-left-toolbar">
            <div
              onClick={this.toggle}
              className="grid-item-select-button"
            >
              <i className="grid-item-select-button-top fa fa-th"></i><br/>
              <i className="grid-item-select-button-bottom fa fa-th"></i>
            </div>
          </div>
          <div className="card-header-right-toolbar">
            <button 
              onClick={this.toggle}
              className="card-button expand-button pull-right"
            >
              <i className={"fa "+(this.state.shouldExpand?"fa-caret-down":"fa-caret-left")}></i>
            </button>
          </div>
          <div className="card-header-summary">
            <Summary item={item} />
          </div>
        </div>
        {Detail&&(this.state.shouldExpand||this.state.didExpand)?
        <div className="card-body">
          <div className="card-body-right-toolbar">
            <button 
              onClick={this.toggle}
              className="card-button expand-button pull-right"
            >
              <i className={"fa "+(this.state.shouldExpand?"fa-caret-down":"fa-caret-left")}></i>
            </button>
            <button 
                onClick={this.deleteItem} 
                className="card-button delete-button pull-right"
            >
                <i className="fa fa-paperclip"></i>
            </button>
            <button 
                onClick={this.deleteItem} 
                className="card-button delete-button pull-right"
            >
                <i className="fa fa-camera"></i>
            </button>
            <button 
                onClick={this.deleteItem} 
                className="card-button delete-button pull-right"
            >
                <i className="fa fa-trash-o"></i>
            </button>
          </div>
          <Detail item={item}/>
        </div>:null}
      </div>

    )
  }
});