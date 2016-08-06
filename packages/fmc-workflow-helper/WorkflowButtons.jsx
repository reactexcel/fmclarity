import React from "react";

export default React.createClass({

    render() {
        var request = this.props.item;
        var width = this.props.width||"100px";
        var actions = request.getActions();
        return (
            <div>
                {actions&&actions.length?actions.map((action)=>{
                    if(request.canDoAction(action)) {
                        return <button 
                            key={action}
                            onClick={()=>{request.doAction(action)}}
                            style={{width:width}} 
                            type="button" 
                            className={"btn btn-flat"+(!request.checkDoAction(action)?' disabled':'')}>
                            {action}
                        </button>
                    }
                }):null}
            </div>
        )
    }
});