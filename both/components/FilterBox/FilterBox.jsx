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
              onClick={newItemCallback} 
              className="new-card-button pull-right"
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
    var shouldExpand = this.props.item.isNewItem?true:false;
    return {
      shouldExpand:shouldExpand,
      didExpand:false
    }
  },

  expand() {
    if(!this.state.didExpand) {
      var i = $(React.findDOMNode(this));
      //$('.gigante').not(i).removeClass('gigante');
      i.addClass('pre-gigante');
      i.toggleClass('gigante',250,function(){
        i.removeClass('diminished pre-gigante');        
      });
      this.setState({
        didExpand:true
      });
      /*i.toggleClass('gigante',250,function(){
        //i.removeClass('pre-gigante');
        this.setState({
          didExpand:true
        });
      })*/
    }
  },

  contract() {
    if(this.state.didExpand) {
      var i = $(React.findDOMNode(this));
      i.toggleClass('gigante',250);
      this.setState({
        didExpand:false
      })
    }
  },

  toggle() {
    var newState = this.state;
    newState.shouldExpand = !newState.shouldExpand;
    this.setState(newState);
  },

  componentDidUpdate () {
    if(this.state.shouldExpand&!this.state.didExpand) {
      this.expand();
    }
    else if(this.state.didExpand&!this.state.shouldExpand) {
      this.contract();
    }
  },

  render() {
    var $this = this;
    var item = this.props.item;
    var Summary = this.props.itemView.summary;
    var Detail = this.props.itemView.detail;
    return (
      <div 
        className={(item.isNewItem?"new-grid-item diminished ":'')+"grid-item"}
      >
        <div className="card-header">
          <div className="card-header-left-toolbar">
            <div
              onClick={this.toggle}
              className="grid-item-select-button"
            >
              <i className="grid-item-select-button-top fa fa-th"></i><br/>
              <i className="grid-item-select-button-bottom fa fa-th"></i>
            </div>
          </div>
          <div className="card-header-summary">
            <Summary item={item} />
          </div>
          <div className="card-header-right-toolbar">
          </div>
        </div>
        <div className="card-body">
          <Detail item={item}/>
        </div>
      </div>

    )
  }
});