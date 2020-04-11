import React from 'react';

class GroupRequest extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            requests:[],
            user:'',
            error:''
        }
        this.change= this.change.bind(this);
    }
    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split('group/')[1].split('/')[0]}/memberrequest`,{
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
            if(data.requests){
            this.setState({
                isLoading:false,
                requests:data.requests
            })
        }
        }).catch(()=>{
            this.setState({
                error:'ERROR... only leader and council of leaders are permitted to view member requests'
            })
        })
    }

    change(event){
        var name = event.target.name;
        var id = name.split(':')[0];
        var choice = name.split(':')[1];
        var k =name.split(':')[2];
        var user = name.split(':')[3];
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split('group/')[1].split('/')[0]}/${id}/memberrequest`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:'include',
                body:JSON.stringify({choice,_id:user})
            }).then((data)=>{
                if(data.ok){
                    var noti = this.state.requests;
                    noti.splice(k,1);
                    this.setState({
                        requests:noti
                    })
                }else{
                    this.setState({
                        error:"Error while processing the request"
                    })
                }
            })
        }
    
    render(){
        var requests=[];
        if(this.state.requests){
            var k=-1;
        requests=this.state.requests.map((request)=>{
            k++;
            var name = request.message.split(' ')[0];
            var message= request.message.split(name)[1];
                return(
                    <div key={request._id} className='post' name={request._id} >
                        <p><a href={`/profile/${name}`} className='comment_link'>{name}</a>{message}</p>
                        <button className='notification_button' name={`${request._id}:accept:${k}:${request.user}`}onClick={this.change}>accept</button>
                        <button className='notification_button' name={`${request._id}:reject:${k}:${request.user}`} onClick={this.change}>reject</button>
                    </div>
                )
            })
        }
        return(
            <div>
                {this.state.error?<p>{this.state.error}</p>:
                <div>
                {this.state.isLoading?<p>LOADING</p>:
                <div>
                <a className='comment_link' href={window.location.href.split('/memberrequest')[0]}>BACK</a>
                <div className='notification material'>
                    {requests.length>0?
                    <div>
                    <div>{requests}</div>
                    </div>
                    :
                    <p>NO requests</p>}                
                </div>
                </div>
                }
                </div>
                }
            </div>
        )
    }
}

export default GroupRequest;