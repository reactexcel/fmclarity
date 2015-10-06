FilterBox = React.createClass({

  handleFieldChange(rowIdx, field, val) {
    // If we were lazy here, we would simply write
    //     this.state.data[rowIdx][field] = val;
    //     this.forceUpdate();
    // but mutating in this way can be confusing and prevents performance
    // optimizations later, so we instead treat the current data as
    // immutable and copy it when modifying:
    var row = _.clone(this.state.items[rowIdx]);
    row[field] = val;
    var rows = this.state.items.slice();
    rows[rowIdx] = row;
    this.setState({items: rows});
  },

	componentDidMount() {
    this.title = this.props.title;
    this.card = this.props.card;
    this.items = this.props.items;
    this.applyFilter();
	},

  getInitialState() {
    return {
      selectedFilterNum:0
      //items:this.props.items
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
    var Card = $this.props.card;
    var Header = $this.props.header;
    var initialItems = $this.props.items;
    var newItemCallback = this.props.newItemCallback;
    var items = $this.applyFilter(initialItems);
    return (
      <div>
        <div className="ibox">
          <div className="ibox-title">
            <button onClick={newItemCallback} className="new-card-button pull-right">+</button>
            {title?<h5>{title}</h5>:null}
            {!filters?null:
            <ol id="filters" className="breadcrumb">
              {filters.map(function(i,index){
                return (
                  <li className={selectedFilterNum==index?'active':''}>
                    <a onClick={$this.setFilter.bind(null,index)}>{i.text}</a>
                  </li>
                )
              })}
            </ol>}
          </div>
          <div className="ibox-content" style={{paddingBottom:0,paddingTop:0}}>
            <div className="row isotope">
              {!Header?null:<Header item={items[0]} />}
              <CardGrid card={Card} items={items} numCols={$this.props.numCols} handleFieldChange={$this.handleFieldChange}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

CardGrid = React.createClass({

  expandItem(event) {
    var i = $(event.target).closest('.grid-item');
    $('.gigante').not(i).removeClass('gigante');
    i.toggleClass('pre-gigante');
    i.toggleClass('gigante',250,function(){
      i.removeClass('pre-gigante');
    })
  },

  render() {
    var items = this.props.items;
    var Card = this.props.card;
    var me = this;
    var handleFieldChange = this.props.handleFieldChange;
    var numCols = parseInt(this.props.numCols) || 1;
    var colSize = Math.floor(12 / numCols);
    return (
      <div>
        {items.map(function(i,index){
          return (
            <div 
              onDoubleClick={me.expandItem} 
              className={"col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12 grid-item"}
              >
              <Card
                item={i} 
                handleFieldChange={handleFieldChange.bind(null,index)}
              />
            </div>
          )
        })}
      </div>
    )
  }
});