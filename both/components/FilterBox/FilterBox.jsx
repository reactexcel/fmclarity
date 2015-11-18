FilterBox = React.createClass({

	componentDidMount() {
    this.title = this.props.title;
    this.card = this.props.card;
    this.items = this.props.items;
    this.applyFilter();
	},

  getInitialState() {
    return {
      selectedFilterNum:0,
      selectedSortNum:2,
      sortDirection:1
    }
  },

  applyFilter(items) {
    var filters = this.props.filters;
    if(items&&filters) {
      var filter = filters[this.state.selectedFilterNum].filter;
      if(filter) {
        return _.filter(items,filter);
      }
    }
    return items;
  },

  applySort(items) {
    var headers = this.props.headers;
    if(items&&headers) {
      var f = headers[this.state.selectedSortNum].sortFunction;
      var modifier = this.state.sortDirection;
      if(f) {
        return items.sort(function(a,b){
          return f(a,b)*modifier;
        });
      }
    }
    return items;
  },

  setFilter(filterNum) {
    this.setState({
      selectedFilterNum:filterNum
    })
  },

  setSort(sortNum) {
    var sortDirection = this.state.sortDirection;
    if(sortNum==this.state.selectedSortNum) {
      sortDirection*=-1;
    }
    else {
      sortDirection = 1;
    }
    this.setState({
      selectedSortNum:sortNum,
      sortDirection:sortDirection
    })
  },

  createNewItem() {
    this.setFilter(0);
    this.setSort(2);
    this.props.newItemCallback();
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
              {items.map(function(i,index){
                if(i.sticky)
                return (
                  <div 
                    key={i._id}
                    style={{padding:0}}
                    className={"table-row col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12"}
                  >
                    <CardWrapper 
                      item={i}
                      itemView={$this.props.itemView}
                    />
                  </div>
                )
              })}
              {items.map(function(i,index){
                if(!i.sticky)
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
    return {
      shouldExpand:false,
      didExpand:false
    }
  },

  deleteItem() {
    var dom = $(ReactDOM.findDOMNode(this));
    var parent = dom.closest('.grid-item');
    var $this = this;
    parent.toggleClass('diminished gigante',250,function(){
      $this.props.item.destroy();
      //Meteor.call("Issue.destroy",$scope.facility);
    });
  },    

  expand() {
    var $this = this;
    $this.isAnimating = true;
    var i = $(ReactDOM.findDOMNode($this));
    i.addClass('pre-gigante');
    i.toggleClass('gigante',250,function(){
      i.removeClass('diminished pre-gigante');
      $this.isAnimating = false;
      $this.setState({
        didExpand:true,
        shouldExpand:true,
      });
    });
  },

  contract() {
    var $this = this;
    $this.isAnimating = true;
    var i = $(ReactDOM.findDOMNode($this));
    i.toggleClass('gigante',250,function(){
      $this.isAnimating = false;
      $this.setState({
        didExpand:false,
        shouldExpand:false,
      });
      if($this.props.item.isNewItem) {
        $this.props.item.destroy();
      }
    });
  },

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


  markupCheckboxes() {
    $(this.refs.iCheck).iCheck({
      checkboxClass: 'icheckbox_square-grey'
    });
  },


  componentWillReceiveProps() {
    if(this.props.item.isNewItem) {
      this.setState({
        shouldExpand:true
      });
    }
  },

  componentDidMount() {
    this.markupCheckboxes();
  },

  componentDidUpdate () {
    if(!this.state.didExpand&&this.state.shouldExpand) {
      this.expand();
    }
    else if(this.state.didExpand&&!this.state.shouldExpand) {
      this.contract();
    }
  },

  toggleSticky() {
    this.item.sticky = this.item.sticky?false:true;
    this.item.save();
  },

  render() {
    var $this = this;
    var item = this.item = this.props.item;
    var creator = this.item.getCreator?this.item.getCreator():{};
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
        <div className="card-header">
        {/*
          <div className="card-header-left-toolbar">
            <div className="hide-on-hover" style={{position:"absolute",top:"7px",left:"7px"}}>
              <ContactAvatarSmall item={creator} />
            </div>
            <div className="show-on-hover">
              <input ref="iCheck" type="checkbox"/>
            </div>
          </div>
        */}
          <div className="card-header-right-toolbar">
            <div
              style={{padding:"10px 5px 7px 13px",fontSize:"20px",opacity:item.sticky?1:0.1,color:item.sticky?"blue":"#000"}}
              onClick={this.toggleSticky}
              className="grid-item-select-button"
            >
              <i className="fa fa-thumb-tack"></i>
            </div>
          {/*
            <button 
              onClick={this.toggle}
              className="card-button expand-button pull-right"
            >
            </button>
          */}
          </div>
          <div className="card-header-summary" onClick={this.toggle}>
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
              <i className={"fa fa-close"}></i>
            </button>
          </div>
          <Detail item={item}/>
        </div>:null}
      </div>

    )
  }
});