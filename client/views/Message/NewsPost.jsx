
NewsPost = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var query, post, creator;
        query = this.props.item;
        post = Posts.findOne(query);
        if(post) {
            creator = post.getCreator()
        }
        return {
            creator:creator,
            post:post
        }
    },

    componentDidMount() {
        $(this.refs.input).elastic();
    },

    submit() {
        var input = this.refs.input;
        Meteor.call("Posts.new",{
            feedId:this.props.feedId,
            subject:"posted to "+this.props.feedName,
            body:input.value
        });
        input.value = null;
    },    

    handleKeyPress(event) {
        if(!event.shiftKey&&event.keyCode==13) {
            event.preventDefault();
            this.submit(event);
        }
    },

    render() {
        var post = this.data.post||{};
        var creator = this.data.creator||Meteor.user();
        var createdAt = post.createdAt;
        var used = false;
        return(
            <div>
                <ContactAvatarSmall item={creator}/>
                <div className="media-body">
                    {post.body||post.subject?
                    <div>
                        <small className="pull-right">{moment(post.createdAt).fromNow()}</small>
                        <strong>{creator.getName()}</strong> {post.subject}<br/>
                        <small className="text-muted">{moment(createdAt).format('MMM Do YYYY, h:mm:ss a')}</small>
                        <div>{post.body}</div>
                    </div>
                    :
                    <textarea 
                        ref="input"
                        style={{width:"80%"}}
                        placeholder="Leave a comment or question..."
                        className={"input inline-form-control "+(used?'used':'')}
                        defaultValue={post.body} 
                        onKeyDown={this.handleKeyPress}>
                    </textarea>
                    }
                </div>
            </div>
        )
    }
});