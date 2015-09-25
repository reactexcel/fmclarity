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
        var $container = $('.isotope').isotope({
            itemSelector: '.element-item',
            layoutMode: 'fitRows',
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
        // bind filter button click
        $('#filters').on( 'click', 'a', function() {
            var filterValue = $( this ).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[ filterValue ] || filterValue;
            $container.isotope({ filter: filterValue });
        });

        // bind sort button click
        $('#sorts').on( 'click', 'a', function() {
            var sortByValue = $(this).attr('data-sort-by');
            $container.isotope({ sortBy: sortByValue });
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
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading" style={{"marginLeft":"0","height":"90px"}}>
                    <div className="col-lg-12">
                        <h2 style={{marginTop:"16px"}}>{this.props.title}</h2>
                        <ol id="filters" className="breadcrumb">
                            <li className="active"><a data-filter="*">All</a></li>
                            <li><a data-filter=".metal">Open Requests</a></li>
                            <li><a data-filter=".transition">Closed Requests</a></li>
                            <li><a data-filter=".alkali, .alkaline-earth">Open Orders</a></li>
                            <li><a data-filter=":not(.transition)">Closed Orders</a></li>
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
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="isotope">
                              <div className="element-item transition metal " data-category="transition">
                                <h3 className="name">Mercury</h3>
                                <p className="symbol">Hg</p>
                                <p className="number">80</p>
                                <p className="weight">200.59</p>
                              </div>
                              <div className="element-item metalloid " data-category="metalloid">
                                <h3 className="name">Tellurium</h3>
                                <p className="symbol">Te</p>
                                <p className="number">52</p>
                                <p className="weight">127.6</p>
                              </div>
                              <div className="element-item post-transition metal " data-category="post-transition">
                                <h3 className="name">Bismuth</h3>
                                <p className="symbol">Bi</p>
                                <p className="number">83</p>
                                <p className="weight">208.980</p>
                              </div>
                              <div className="element-item post-transition metal " data-category="post-transition">
                                <h3 className="name">Lead</h3>
                                <p className="symbol">Pb</p>
                                <p className="number">82</p>
                                <p className="weight">207.2</p>
                              </div>
                              <div className="element-item transition metal " data-category="transition">
                                <h3 className="name">Gold</h3>
                                <p className="symbol">Au</p>
                                <p className="number">79</p>
                                <p className="weight">196.967</p>
                              </div>
                              <div className="element-item alkali metal " data-category="alkali">
                                <h3 className="name">Potassium</h3>
                                <p className="symbol">K</p>
                                <p className="number">19</p>
                                <p className="weight">39.0983</p>
                              </div>
                              <div className="element-item alkali metal " data-category="alkali">
                                <h3 className="name">Sodium</h3>
                                <p className="symbol">Na</p>
                                <p className="number">11</p>
                                <p className="weight">22.99</p>
                              </div>
                              <div className="element-item transition metal " data-category="transition">
                                <h3 className="name">Cadmium</h3>
                                <p className="symbol">Cd</p>
                                <p className="number">48</p>
                                <p className="weight">112.411</p>
                              </div>
                              <div className="element-item alkaline-earth metal " data-category="alkaline-earth">
                                <h3 className="name">Calcium</h3>
                                <p className="symbol">Ca</p>
                                <p className="number">20</p>
                                <p className="weight">40.078</p>
                              </div>
                              <div className="element-item transition metal " data-category="transition">
                                <h3 className="name">Rhenium</h3>
                                <p className="symbol">Re</p>
                                <p className="number">75</p>
                                <p className="weight">186.207</p>
                              </div>
                              <div className="element-item post-transition metal " data-category="post-transition">
                                <h3 className="name">Thallium</h3>
                                <p className="symbol">Tl</p>
                                <p className="number">81</p>
                                <p className="weight">204.383</p>
                              </div>
                              <div className="element-item metalloid " data-category="metalloid">
                                <h3 className="name">Antimony</h3>
                                <p className="symbol">Sb</p>
                                <p className="number">51</p>
                                <p className="weight">121.76</p>
                              </div>
                              <div className="element-item transition metal " data-category="transition">
                                <h3 className="name">Cobalt</h3>
                                <p className="symbol">Co</p>
                                <p className="number">27</p>
                                <p className="weight">58.933</p>
                              </div>
                              <div className="element-item lanthanoid metal inner-transition " data-category="lanthanoid">
                                <h3 className="name">Ytterbium</h3>
                                <p className="symbol">Yb</p>
                                <p className="number">70</p>
                                <p className="weight">173.054</p>
                              </div>
                              <div className="element-item noble-gas nonmetal " data-category="noble-gas">
                                <h3 className="name">Argon</h3>
                                <p className="symbol">Ar</p>
                                <p className="number">18</p>
                                <p className="weight">39.948</p>
                              </div>
                              <div className="element-item diatomic nonmetal " data-category="diatomic">
                                <h3 className="name">Nitrogen</h3>
                                <p className="symbol">N</p>
                                <p className="number">7</p>
                                <p className="weight">14.007</p>
                              </div>
                              <div className="element-item actinoid metal inner-transition " data-category="actinoid">
                                <h3 className="name">Uranium</h3>
                                <p className="symbol">U</p>
                                <p className="number">92</p>
                                <p className="weight">238.029</p>
                              </div>
                              <div className="element-item actinoid metal inner-transition " data-category="actinoid">
                                <h3 className="name">Plutonium</h3>
                                <p className="symbol">Pu</p>
                                <p className="number">94</p>
                                <p className="weight">(244)</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
	   )
    }


});