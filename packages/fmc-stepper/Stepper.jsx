import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

Stepper = React.createClass({
    getInitialState() {
        return {
            active:0
        }
    },

    selectTab(idx) {
        if(this.props.tabs[idx]&&this.props.tabs[idx].onClick) {
            idx = this.props.tabs[idx].onClick();
        }
        this.setState({
            active:idx
        });
    },

    selectNext() {
    	var idx = parseInt(this.state.active);
    	this.selectTab(idx+1);
    	if(this.state.active>=this.props.tabs.length-1) {
    		Modal.hide();
    	}
    },

    selectPrev() {
    	var idx = this.state.active;
    	this.selectTab(parseInt(idx)-1);
    },

    render() {
        var active = this.state.active;
        var selectTab = this.selectTab;
        var selectNext = this.selectNext;
        var selectPrev = this.selectPrev;
        var tabs = this.props.tabs;
        return (
            <div className="ipso-stepso row">
                {tabs.map(function(i,idx){
                    return (
                        <div key={idx} className="col-md-12">
                            <div className={(idx==active?"ipso-stepso active":"ipso-stepso")}>

                                <div onClick={selectTab.bind(null,idx)} className="ipso-stepso-title">
                                    <span className="ipso-step-num">{parseInt(idx)+1}</span>
                                    {i.tab}
                                </div>
                                {active==idx?
                                	<div className="ipso-stepso-instructions">
                                		{i.instructions||i.guide}
                                	</div>
                            	    :null
                            	}

                                <div className="ipso-stepso-content">
                                	{active==idx?
                                		<div>
                                			{i.content}
			                                <div>
												<button onClick={selectNext} type="button" className="btn btn-primary">
													<span>{idx<(tabs.length-1)?"Next":"Finish"}</span>
												</button>
			                                </div>
                                		</div>
                                		:null
                                	}
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

});