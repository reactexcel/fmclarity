Footer = React.createClass({
	componentDidMount() {

    // FIXED FOOTER
    // Uncomment this if you want to have fixed footer or add 'fixed' class to footer element in html code
    // $('.footer').addClass('fixed');

	},
	render() {return (
	    <div className="footer">
	        <div className="pull-right">
	            10GB of <strong>250GB</strong> Free.
	        </div>
	        <div>
	            <strong>Copyright</strong> Example Company &copy; 2014-2015
	        </div>
	    </div>
	)}
});