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
            <div className="panel blank-panel tab-panel">
                <div className="panel-heading">
                    <div className="row" style={{margin:0}}>
                    {tabs.map(function(i,idx){
                        return (
                            <div 
                                onClick={selectTab.bind(null,idx)} 
                                className={"col-xs-4 col-sm-2 "+(idx==active?"ipso-tab active":"ipso-tab")}
                                key={idx}
                            >
                                <div className="btn btn-sm btn-flat issue-nav-btn">{i.tab}</div>
                                <div className="highlight"/>
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div className="tab-pane active">
                    {content}
                </div>
            </div>
        )
    }

});