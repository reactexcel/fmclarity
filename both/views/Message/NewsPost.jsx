
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

    submit(event) {
        var callback = this.props.onChange;
        var post = this.data.post||{
            creator:{
                _id:Meteor.userId()
            }
        };
        post.body = event.target.value;
        // returns reference object to save
        Meteor.call("Posts.save",post,function(err,response){
            event.target.value = null;
            if(callback) {
                callback(response);
            }
        })
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
                    <small className="pull-right">{moment(post.createdAt).fromNow()}</small>
                    {post.body||post.subject?
                    <div>
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