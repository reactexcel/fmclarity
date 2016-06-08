import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

IpsoTabso = React.createClass({
    getInitialState() {
        return {
            active:0
        }
    },

    selectTab(idx) {
        if(this.props.tabs[idx].onClick) {
            idx = this.props.tabs[idx].onClick();
        }
        this.setState({
            active:idx
        });
    },

    render() {
        var active = this.state.active;
        var selectTab = this.selectTab;
        var tabs = this.props.tabs;
        var content = tabs[active]?tabs[active].content:null;
        return (
            <div className="tab-panel">
                <div className="panel-heading">
                    <div className="row" style={{margin:0}}>
                        <div className="col-md-12">
                            <div className="row tab-row">
                                {tabs.map(function(i,idx){
                                    return (
                                        <div 
                                            onClick={selectTab.bind(null,idx)} 
                                            className={(idx==active?"ipso-tab active":"ipso-tab")}
                                            key={idx}
                                        >
                                            <div className="tab">{i.tab}</div>
                                            <div className="highlight"/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane active">
                    {content}
                </div>
            </div>
        )
    }

});