NewsFeed = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query,feed;
        query = this.props.feed;
        feed = query?Feeds.findOne(query):{posts:[]};
        return {
            feed:feed
        }
    },

    updatePost(index,newPost) {
        var feed = this.data.feed;
        if(!feed) {
            return;
        }
        var onChange = this.props.onChange;
        feed.posts[index] = newPost;
        Meteor.call("Feeds.save",feed,function(err,newFeed){
            if(onChange&&newFeed&&newFeed._id) {
                onChange({_id:newFeed._id});
            }
        });
    },    

    render(){
        var feed, posts, watchers, component;
        feed = this.data.feed;
        if(feed) {
            posts = feed.posts?feed.posts:[];
        }
        else {
            posts = [];
        }
        watchers = this.props.watchers||[];
        component = this;
        return (
            <div className="feed-activity-list">
                {posts.map(function(post,idx){
                    return (
                        <div key={idx} className="feed-element">
                            <NewsPost
                                item={post}
                                onChange={component.updatePost.bind(null,idx)}
                            />
                        </div>
                    )
                })}
            
                <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                    <NewsPost 
                        onChange={component.updatePost.bind(null,posts.length)}
                    />
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

