MessagesPage = React.createClass({
    render() {
        var user, feed;
        user = Meteor.user();
        if(!user) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="ibox" style={{padding:"20px"}}>
                                <NewsFeed feedId={user.getFeedId()} feedName={user.getFeedName()}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})