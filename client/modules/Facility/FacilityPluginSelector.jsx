import React from "react";


FacilityPluginSelector = React.createClass({

    modules:[{
        name:"Reactive",
        icon:"icons/plugins/adhoc.jpg",
        description:"Create work requests that can be sent to you supplier contacts",
        active:true,
        price:0,
        config:()=>{
            Modal.show({
                size:"large",
                content:<ConfigureAdHoc/>
            })
        }
    },{
        name:"Sign in register",
        icon:"icons/plugins/sign-in.jpg",
        description:"Keep records of on site attendances for personel and guests",
        active:false,
        price:75,
        config:()=>{
            Modal.show({
                content:<ConfigureAdHoc/>
            })
        }
    },{
        name:"Periodic",
        icon:"icons/plugins/periodic.jpg",
        description:"Configure cyclic maintenence tasks",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Periodic</h1>
            })
        }
    },{
        name:"Bookings",
        icon:"icons/plugins/bookings.jpg",
        description:"Book areas and schedule events",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Bookings</h1>
            })
        }
    },{
        name:"Compliance",
        icon:"icons/plugins/compliance.jpg",
        description:"Automatically rate and track your buildings compliance",
        active:false,
        price:100,
        config:()=>{
            Modal.show({
                content:<h1>Compliance</h1>
            })
        }
    },{
        name:"Predictive",
        icon:"icons/plugins/predictive.jpg",
        description:"Data analytics that can help you improve the effectiveness of you maintenence tasks",
        active:false,
        price:150,
        config:()=>{
            Modal.show({
                content:<h1>Predictive</h1>
            })
        }
    },{
        name:"Live Building",
        icon:"icons/plugins/live.jpg",
        description:"Configure your facility to communicate directly with FMC",
        active:false,
        price:150,
        config:()=>{
            Modal.show({
                content:<h1>Live Building</h1>
            })
        }
    }],

    render() {
        var modules = this.modules;
        return (   
            <div className="feed-activity-list">
                {modules.map((mod)=>{
                    return (
                        <div className="feed-element">
                            <div>

                                {mod.active?
                                    <button onClick={()=>{mod.config()}} className="btn btn-success" style={{width:"110px",float:"right"}}>Configure</button>
                                :
                                    <button onClick={()=>{mod.active=true;mod.config()}} className="btn btn-default" style={{width:"110px",float:"right"}}>${mod.price}/mo</button>
                                }

                                <img style={{width:"35px",height:"35px",float:"left",marginRight:"10px"}} 
                                src={mod.icon}/>
                                <div className="media-body message-type-undefined" style={{whiteSpace: "pre-wrap"}}>
                                    <div>
                                        <div className="message-subject">
                                            <a><span style={{color:(mod.active?"inherit":"#999"),fontWeight:"bold"}}>{mod.name}</span></a>
                                        </div>
                                        <div className="message-body">{mod.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
})