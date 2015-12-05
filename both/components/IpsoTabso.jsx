IpsoTabso = React.createClass({
    getInitialState() {
        return {
            active:0
        }
    },

    selectTab(activeIndex) {
        this.setState({
            active:activeIndex
        });
    },

    render() {
        var active = this.state.active;
        var selectTab = this.selectTab;
        var tabs = this.props.tabs;
        var content = tabs[active]?tabs[active].content:null;
        return (
            <div className="panel blank-panel">
                <div className="panel-heading">
                    {tabs.map(function(i,idx){
                        return (
                            <div 
                                onClick={selectTab.bind(null,idx)} 
                                className={idx==active?"issue-tab active":"issue-tab"}
                                key={idx}
                            >
                                <div className="btn btn-sm btn-flat issue-nav-btn">{i.tab}</div>
                                <div className="highlight"/>
                            </div>
                        )
                    })}
                </div>
                <div className="panel-body" style={{padding:"0 0 10px 0"}}>
                    <div className="tab-content">
                        <div className="tab-pane active">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

});