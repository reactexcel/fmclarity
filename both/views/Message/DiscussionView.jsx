Discussion = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query,discussion;
        query = this.props.discussion;
        discussion = query?Discussions.findOne(query):{posts:[]};
        return {
            discussion:discussion
        }
    },

    updatePost(index,newPost) {
        var discussion = this.data.discussion;
        var onChange = this.props.onChange;
        discussion.posts[index] = newPost;
        Meteor.call("Discussions.save",discussion,function(err,newDiscussion){
            if(onChange&&newDiscussion&&newDiscussion._id) {
                console.log({'err':err,'save this motherfucker...':newDiscussion})
                onChange({_id:newDiscussion._id});
            }
        });
    },    

    render(){
        var discussion = this.data.discussion;
        var watchers = this.props.watchers||[];
        var component = this;
        return (
            <div className="feed-activity-list">
                {discussion.posts.map(function(post,idx){
                    return (
                        <div key={idx} className="feed-element">
                            <DiscussionPost
                                value={post}
                                onChange={component.updatePost.bind(null,idx)}
                            />
                        </div>
                    )
                })}
            
                <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                    <DiscussionPost 
                        onChange={component.updatePost.bind(null,discussion.posts.length)}
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

