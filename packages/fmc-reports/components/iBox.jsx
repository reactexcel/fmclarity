import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

Box = React.createClass({

    handleCollapse(event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    },

    handleClose(event) {
        var element = $(event.target);
        var content = element.closest('div.ibox');
        content.remove();

    },

    handleFullScreen(event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function() {
            $(window).trigger('resize');
        }, 100);

    },

	render() {return (
		<div className="ibox float-e-margins">
			<div className="ibox-title">
				<h5>{this.props.title}</h5>

				<div className="ibox-tools">
					<a onClick={this.handleCollapse}>
						<i className="fa fa-chevron-up"></i>
					</a>
					<a className="dropdown-toggle" data-toggle="dropdown" href="#">
						<i className="fa fa-wrench"></i>
					</a>
					<ul className="dropdown-menu dropdown-user">
						<li><a href="#">Config option 1</a>
						</li>
						<li><a href="#">Config option 2</a>
						</li>
					</ul>
					<a onClick={this.handleClose}>
						<i className="fa fa-times"></i>
					</a>
				</div>

			</div>

            <div className="ibox-content">
                {this.props.children}
            </div>

		</div>
	);}
});