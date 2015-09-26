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

OrderCard = React.createClass({
  render() {
    var i = this.props.item;
    return (
      <div className={"grid-item grid-item-order "+i.tags} data-category={i.tags}>
        <div className="row">
          <div className="col-lg-1 col-md-1">
            <span className="label label-danger">New</span>
          </div>
          <div className="col-lg-4 col-md-4 issue-info">
            <a href="#">
              ISSUE-23
            </a>
            <small>
              {i.description}
            </small>
          </div>
          <div className="col-lg-2 col-md-2">
            {i.name}
          </div>
          <div className="col-lg-2 col-md-2">
            12.02.2015 10:00 am
          </div>
          <div className="col-lg-1 col-md-1">
            <span className="pie" style={{display:"none"}}>0.52,1.041</span><svg class="peity" height="16" width="16"><path d="M 8 8 L 8 0 A 8 8 0 0 1 14.933563796318165 11.990700825968545 Z" fill="#1ab394"></path><path d="M 8 8 L 14.933563796318165 11.990700825968545 A 8 8 0 1 1 7.999999999999998 0 Z" fill="#d7d7d7"></path></svg>
              2d
          </div>
          <div style={{display:"none"}} className="col-lg-2 col-md-2 text-right">
            <button className="btn btn-white btn-xs"> Tag</button>
            <button className="btn btn-white btn-xs"> Mag</button>
            <button className="btn btn-white btn-xs"> Rag</button>
          </div>
        </div>
      </div>
    )
  }

});

FilterBox = React.createClass({

    filterFns:{
        // show if number is greater than 50
        numberGreaterThan50: function() {
          var number = $(this).find('.number').text();
          return parseInt( number, 10 ) > 50;
        },
        // show if name ends with -ium
        ium: function() {
          var name = $(this).find('.name').text();
          return name.match( /ium$/ );
        }
    },

    markupIsotope() {
        var filterFns = this.filterFns;
        var $grid = $('.isotope').isotope({
            itemSelector: '.grid-item',
            layoutMode: 'vertical',
            transitionDuration: '0.1s',
            getSortData: {
              name: '.name',
              symbol: '.symbol',
              number: '.number parseInt',
              category: '[data-category]',
              weight: function( itemElem ) {
                var weight = $( itemElem ).find('.weight').text();
                return parseFloat( weight.replace( /[\(\)]/g, '') );
              }
            }
        });

        $grid.on( 'click', '.grid-item', function() {
          $grid.find('.gigante').not(this).removeClass('gigante');
          $(this).toggleClass('pre-gigante');
          $(this).toggleClass('gigante',250,function(){
            $grid.isotope('layout');
            $grid.find('.pre-gigante').removeClass('pre-gigante');
          });
          // trigger layout after item size changes
        });

        // bind filter button click
        $('#filters').on( 'click', 'a', function() {
            var filterValue = $( this ).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[ filterValue ] || filterValue;
            $grid.isotope({ filter: filterValue });
        });

        // bind sort button click
        $('#sorts').on( 'click', 'a', function() {
            var sortByValue = $(this).attr('data-sort-by');
            $grid.isotope({ sortBy: sortByValue });
        });
      
        // change is-checked class on buttons
        $('#filters').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'a', function() {
                $buttonGroup.find('.active').removeClass('active');
                $( this ).parent().addClass('active');
            });
        });
    },

	componentDidMount() {
        this.markupIsotope();
	},
	
	render() {
    var title = this.props.title;
    var filters = this.props.filters;
    var Card = this.props.card || OrderCard;

    var data = [
      {
        name:"Mercury",
        description:"Toilet won't flush. Brown liquid leaking onto floor.",
        symbol:"Hg",
        number:80,
        weight:200.59,
        tags:"transition metal"
      },
      {
        name:"Tellurium",
        description:"Ceiling fan dropping rust.",
        symbol:"Te",
        number:52,
        weight:127.6,
        tags:"metalloid"
      },
      {
        name:"Bismuth",
        description:"Customers entering through sliding doors receiving electric shocks.",
        symbol:"Bi",
        number:83,
        weight:208.980,
        tags:"post-transition metal"
      },
      {
        name:"Lead",
        description:"Barbed wire in staff room a tripping hazard.",
        symbol:"Pb",
        number:82,
        weight:207.2,
        tags:"post-transition metal"
      },
      {
        name:"Gold",
        description:"Live mines in main car park.",
        symbol:"Au",
        number:79,
        weight:196.967,
        tags:"transition metal"
      },
      {
        name:"Potassium",
        description:"Fire extinguishers exploding at random intervals.",
        symbol:"K",
        number:19,
        weight:39.0983,
        tags:"alkali metal"
      },
      {
        name:"Sodium",
        description:"Large cracks appearing in walls on level 7.",
        symbol:"Na",
        number:11,
        weight:39.0983,
        tags:"alkali metal"
      },
      {
        name:"Cadmium",
        description:"Elevator cables fraying.",
        symbol:"Cd",
        number:48,
        weight:112.411,
        tags:"transition metal"
      },
      {
        name:"Calcium",
        description:"Air conditioner producing noxious gas.",
        symbol:"Ca",
        number:20,
        weight:40.078,
        tags:"alkaline-earth metal"
      },
      {
        name:"Rhenium",
        description:"Chairs on level 6 are not ergonomic.",
        symbol:"Re",
        number:75,
        weight:186.207,
        tags:"transition metal"
      },
      {
        name:"Thallium",
        description:"Elevator muzik intermittently cuts out.",
        symbol:"Tl",
        number:81,
        weight:204.383,
        tags:"post-transition metal"
      },
      {
        name:"Antimony",
        description:"Coffee machine producing putrid green liquid.",
        symbol:"Sb",
        number:51,
        weight:121.76,
        tags:"metalloid"
      },
      {
        name:"Cobalt",
        description:"Sparks and smoke regularly emitted from light switches.",
        symbol:"Co",
        number:27,
        weight:58.933,
        tags:"transition metal"
      },
      {
        name:"Ytterbium",
        description:"Visitor mugs in staff room printed with un-funny joke.",
        symbol:"Yb",
        number:70,
        weight:173.054,
        tags:"lanthanoid metal"
      }
    ];
    return (
      <div>
        <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"90px"}}>
          <div className="col-lg-12">
            <h2 style={{marginTop:"16px"}}>{title}</h2>
              <ol id="filters" className="breadcrumb">
                {filters.map(function(i){
                  return (
                    <li className={i.className?i.className:''}><a data-filter={i.filter}>{i.text}</a></li>
                  )
                })}
              </ol>
              <ol id="sorts" style={{display:"none"}}>
                <li className="active"><a data-sort-by="original-order">original order</a></li>
                <li><a data-sort-by="name">name</a></li>
                <li><a data-sort-by="symbol">symbol</a></li>
                <li><a data-sort-by="number">number</a></li>
                <li><a data-sort-by="weight">weight</a></li>
                <li><a data-sort-by="category">category</a></li>
              </ol>
            </div>
                </div>
                <div className="wrapper wrapper-content animated fadeIn">
                  <div className="row" style={{display:"none"}}>
                    <div className="col-lg-12">
                        <div>
                          <div style={{left:0,right:0,margin:0,height:"1000px"}} className="gigante grid-item transition metal " data-category="transition">
                            <h3 className="name">New</h3>
                            <p className="symbol">New</p>
                            <p className="number">80</p>
                            <p className="weight">200.59</p>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="isotope">
                        {data.map(function(i){
                          return (
                            <Card item={i} />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
	   )
    }


});