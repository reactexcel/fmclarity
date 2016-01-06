NewsFeed = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var feedId = this.props.feedId;
        return {
            feedId:feedId,
            messages:Posts.find({feedId:feedId}).fetch()
        }
    },

    render(){
        var component = this;
        var feedId = this.data.feedId;
        var messages = this.data.messages;
        return (
            <div className="feed-activity-list">
                {messages.map(function(message,idx){
                    return (
                        <div key={message._id} className="feed-element">
                            <NewsPost item={message}/>
                        </div>
                    )
                })}
            
                <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                    <NewsPost feedId={feedId} feedName={this.props.feedName}/>
                </div>
            
            </div>
        )
    }
})

IssueDiscussion = React.createClass({
	render() {
		return (
            <div className="feed-activity-list">
                {this.props.items.map(function(n){
                    return (<div key={n._id} className="feed-element">
                        <NotificationSummary item={n} />
                    </div>)
                })}
            </div>
		)
	}
});

