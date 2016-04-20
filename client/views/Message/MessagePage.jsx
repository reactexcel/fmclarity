MessagesPage = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            user:Meteor.user()
        }
    },

    render() {
        var user = this.data.user;
        if(!user) {
            return <div/>
        }
    	return (
            <div>
                <div className="issue-page wrapper wrapper-content animated fadeIn">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="ibox" style={{padding:"20px"}}>
                                <Inbox 
                                    for={user} 
                                    readonly={true}
                                    options={{sort:{createdAt:-1}}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
})