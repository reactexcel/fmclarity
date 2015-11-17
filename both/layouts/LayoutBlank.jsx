BlankLayout = React.createClass({
	componentDidMount() {
	    $('body').addClass('gradient-bg');
	    $('body').prepend('<div id="pattern-bg" class="pattern-bg"/>');
	},
	componentWillUnmount() {
	    $('body').removeClass('gradient-bg');
	    $('#pattern-bg').remove();
	},
	render() {return (
		<main>{this.props.content}</main>
	)}
});
