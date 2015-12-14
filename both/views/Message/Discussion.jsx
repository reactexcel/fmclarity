Discussion = React.createClass({

    handleChange(index,newValue) {
        var messages = this.props.value||[];
        messages[index] = newValue;
        this.props.onChange(messages);
    },    

    render(){
        var messages = this.props.value;
        var component = this;
        return (
            <div className="feed-activity-list">
            {messages.map(function(message,idx){
                return (
                    <div key={message._id} className="feed-element" style={{paddingBottom:0}}>
                        <DiscussionPost
                            value={message}
                            onChange={component.handleChange.bind(null,idx)}
                        />
                    </div>
                )
            })}
            
                <div className="feed-element" style={{paddingBottom:0,borderBottom:"none"}}>
                    <DiscussionPost onChange={component.handleChange.bind(null,messages.length)}/>
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

