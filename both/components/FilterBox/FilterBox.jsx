MetalCard = React.createClass({
  render() {
    var i = this.props.item;
    return (
      <div className={"grid-item "+i.tags} data-category={i.tags}>
        <h3 className="name">{i.name}</h3>
        <p className="symbol">{i.symbol}</p>
        <p className="number">{i.number}</p>
        <p className="weight">{i.weight}</p>
      </div>      
    )
  }
});

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

  markupIsotope() {
    var $grid = $('.isotope');
    $grid.on( 'click', '.grid-item', function() {
      $grid.find('.gigante').not(this).removeClass('gigante');
      $(this).toggleClass('pre-gigante');
      $(this).toggleClass('gigante',250,function(){
        $grid.find('.pre-gigante').removeClass('pre-gigante');
      });
    });
  },

	componentDidMount() {
    this.markupIsotope();
    this.title = this.props.title;
    this.card = this.props.card || MetalCard ;
    this.items = this.props.items || Metals;
    this.applyFilter();
	},

  getInitialState() {
    return {
      selectedFilterNum:0,
      items:this.props.items
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
    var title = this.props.title;
    var filters = this.props.filters;
    var selectedFilterNum = this.state.selectedFilterNum;
    var component = this;
    var Card = this.props.card || MetalCard;
    var Header = this.props.header;
    var initialItems = this.state.items;
    var items = this.applyFilter(initialItems) || Metals;
    return (
      <div>
        <div className="ibox">
          {title||filters?<div className="ibox-title">
            {title?<h5>{title}</h5>:null}
            {!filters?null:
            <ol id="filters" className="breadcrumb">
              {filters.map(function(i,index){
                return (
                  <li className={selectedFilterNum==index?'active':''}>
                    <a onClick={component.setFilter.bind(null,index)}>{i.text}</a>
                  </li>
                )
              })}
            </ol>}
          </div>:null}
          <div className="ibox-content" style={{paddingBottom:0,paddingTop:0}}>
            <div className="row isotope">
              {!Header?null:<Header item={items[0]} />}
              <CardGrid card={Card} items={items} numCols={this.props.numCols} handleFieldChange={this.handleFieldChange}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

CardGrid = React.createClass({
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
            <div className={"col-lg-"+colSize+" col-md-"+colSize+" col-sm-12 col-xs-12 grid-item"}>
              <Card item={i} handleFieldChange={handleFieldChange.bind(null,index)}/>
            </div>
          )
        })}
      </div>
    )
  }
});