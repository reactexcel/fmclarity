/*MainLayout = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <main>{this.props.content}</main>
      </div>
    );
  }
});
*/


MainLayout = React.createClass({

  componentDidMount() {
    // Minimalize menu when screen is less than 768px
    
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small fixed-sidebar')
        } else {
            $('body').removeClass('body-small')
        }
    });
    // Fix height of layout when resize, scroll and load
    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {

            var navbarHeight = $('nav.navbar-default').height();
            var wrapperHeight = $('#page-wrapper').height();

            if(navbarHeight > wrapperHeight){
                $('#page-wrapper').css("min-height", navbarHeight + "px");
            }

            if(navbarHeight < wrapperHeight){
                $('#page-wrapper').css("min-height", $(window).height()  + "px");
            }

            if ($('body').hasClass('fixed-nav')) {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }
    });

    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated, md-skin)
     $('body').addClass('md-skin');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    /*
    $('body').addClass('fixed-sidebar');
     $('.sidebar-collapse').slimScroll({
         height: '100%',
         railOpacity: 0.9
     });
    */
    
    // slim scroll for right sidebar
    $('.sidebar-container').slimScroll({
        height: '100%',
        railOpacity: 0.4,
        wheelStep: 10
    });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    // $('body').addClass('boxed-layout');


  },
  render() {
    return (
      <div id="wrapper">
        <Navigation />
        <div className="gradient-bg">
          {/*<div id="pattern-bg" className="pattern-bg"></div>*/}
          <TopNavBar />
          <main id="page-wrapper">{this.props.content}</main>
          {/*<Footer />*/}
        </div>
        <RightSideBar />
        <Modal/>
      </div>
    );
  }
});

