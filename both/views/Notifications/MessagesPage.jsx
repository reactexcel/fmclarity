MessagesPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user = Meteor.user();
        var feed = user.feed;
        return {
            user:user,
            feed:feed,
        }
    },

    updateFeed: function(newFeed) {
        var user = this.data.user;
        user.feed = newFeed;
        user.save();
    },

    render() {
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="ibox" style={{padding:"20px"}}>
                                <NewsFeed 
                                    feed={this.data.feed} 
                                    onChange={this.updateFeed}                                    
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})