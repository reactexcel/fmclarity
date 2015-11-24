IssueDiscussion = React.createClass({
	render() {
		var issue = this.props.issue;
        var contact = issue.contact || {};
        var supplier = issue.supplier || {};
		return (
            <div className="feed-activity-list">
                <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a2.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right">2h ago</small>
                                                            <strong>{contact.name}</strong> created issue. <br/>
                                                            <small className="text-muted">Today 2:10 pm - 12.06.2014</small>
                                                            <div className="well">
                                                                {issue.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a3.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right">2h ago</small>
                                                            <strong>Janet Rosowski</strong> add 1 photo. <br/>
                                                            <small className="text-muted">2 days ago at 8:30am</small>
                                                        </div>
                                                    </div>
                                                    <div className="feed-element">
                                                        <a href="#" className="pull-left">
                                                            <img alt="image" className="img-circle" src="img/a4.jpg"/>
                                                        </a>
                                                        <div className="media-body ">
                                                            <small className="pull-right text-navy">5h ago</small>
                                                            <strong>{supplier.name}</strong> started looking at <strong>issue</strong>. <br/>
                                                            <small className="text-muted">Yesterday 1:21 pm - 11.06.2014</small>
                                                        </div>
                                                    </div>
                                                </div>
		)
	}
});

Discussion = React.createClass({
  render() {
    return (
    <div className="social-feed-box">

                            <div className="pull-right social-action dropdown">
                                <button data-toggle="dropdown" className="dropdown-toggle btn-white">
                                    <i className="fa fa-angle-down"></i>
                                </button>
                                <ul className="dropdown-menu m-t-xs">
                                    <li><a href="#">Config</a></li>
                                </ul>
                            </div>
                            <div className="social-avatar">
                                <a href="" className="pull-left">
                                    <img alt="image" src="img/a6.jpg"/>
                                </a>
                                <div className="media-body">
                                    <a href="#">
                                        Andrew Williams
                                    </a>
                                    <small className="text-muted">Today 4:21 pm - 12.06.2014</small>
                                </div>
                            </div>
                            <div className="social-body">
                                <p>
                                    Many desktop publishing packages and web page editors now use Lorem Ipsum as their
                                    default model text, and a search for 'lorem ipsum' will uncover many web sites still
                                    in their infancy. Packages and web page editors now use Lorem Ipsum as their
                                    default model text.
                                </p>
                                <p>
                                    Lorem Ipsum as their
                                    default model text, and a search for 'lorem ipsum' will uncover many web sites still
                                    in their infancy. Packages and web page editors now use Lorem Ipsum as their
                                    default model text.
                                </p>
                                <img src="img/gallery/11.jpg" className="img-responsive"/>
                                <div className="btn-group">
                                    <button className="btn btn-white btn-xs"><i className="fa fa-thumbs-up"></i> Like this!</button>
                                    <button className="btn btn-white btn-xs"><i className="fa fa-comments"></i> Comment</button>
                                    <button className="btn btn-white btn-xs"><i className="fa fa-share"></i> Share</button>
                                </div>
                            </div>
                            <div className="social-footer">
                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a1.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 26 Like this!</a> -
                                        <small className="text-muted">12.06.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a2.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Making this the first true generator on the Internet. It uses a dictionary of.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 11 Like this!</a> -
                                        <small className="text-muted">10.07.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a8.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <a href="#">
                                            Andrew Williams
                                        </a>
                                        Making this the first true generator on the Internet. It uses a dictionary of.
                                        <br/>
                                        <a href="#" className="small"><i className="fa fa-thumbs-up"></i> 11 Like this!</a> -
                                        <small className="text-muted">10.07.2014</small>
                                    </div>
                                </div>

                                <div className="social-comment">
                                    <a href="" className="pull-left">
                                        <img alt="image" src="img/a3.jpg"/>
                                    </a>
                                    <div className="media-body">
                                        <textarea className="form-control" placeholder="Write comment..."></textarea>
                                    </div>
                                </div>

                            </div>

                        </div>
  )}
});
