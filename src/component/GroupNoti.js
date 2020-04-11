import React from 'react';

class GroupNoti extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            notification:[],
            error:''
        }
        this.change= this.change.bind(this);
    }
    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/${window.location.href.split('group/')[1].split('/')[0]}/notification`,{
            method:'GET',
            credentials:'include',
            headers:{
                "Content-Type":'application/json'
            }
        }).then((data)=>{
            if(data.ok){
                return data.json();
            }else{
                throw new Error()
            }
        }).then((data)=>{
            if(data.loggedIn){
                window.location.assign('/login')
            }else{

                if(data.notifications){
                    this.setState({
                        isLoading:false,
                        notification:data.notifications
                    })
                }
            }
        }).catch(()=>{
            this.setState({
                error:'ERROR... only leader and council of leaders are permitted to view notifications'
            })
        })
    }

    change(event){
        var name = event.target.name;
        var id = name.split(':')[0];
        var choice = name.split(':')[1];
        var k =name.split(':')[2]
        
        var noti = this.state.notification;
        noti.splice(k,1);
        this.setState({
            notification:noti
        })
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/${window.location.href.split('group/')[1].split('/')[0]}/${id}/request`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:'include',
                body:JSON.stringify({choice})
            }).then((data)=>{
                if(data.ok){
                }else{
                    this.setState({
                        error:"Error while processing the request"
                    })
                }
            })
        }
    
    render(){
        var notifications=[];
        if(this.state.notification){
            var k=-1;
            notifications=this.state.notification.map((notification)=>{
                k++;
                return(
                    <div key={notification._id} name={notification._id} className='post'>
                        <p className='username'>{notification.contributor}</p>
                        <div className='post_body'>{notification.notification}</div>
                        <button className='notification_button' name={`${notification._id}:accept:${k}`}onClick={this.change}>accept</button>
                        <button className='notification_button' name={`${notification._id}:reject:${k}`} onClick={this.change}>reject</button>
                    </div>
                )
            })
        }
        return(
            <div>
                {this.state.error?<p>{this.state.error}</p>:
                <div>
                {this.state.isLoading?<p className='material'>LOADING</p>:
                <div>
                    <a className='comment_link' href={window.location.href.split('/notification')[0]}>BACK</a>
                <div className='notification material'>
                    {notifications.length>0?
                    <div>
                    <div>{notifications}</div>
                    </div>
                    :
                    <p>NO NOTIFICATION</p>}                
                </div>
                </div>
                }
                </div>
                }
            </div>
        )
    }
}

export default GroupNoti;