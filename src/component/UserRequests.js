import React from 'react';
import Header from './Header';

class UserRequests extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            requests:[],
            username:'',
            error:''
        }
        this.submit = this.submit.bind(this);
    }
    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/user/${window.location.href.split('profile/')[1].split('/')[0]}/requests`,{
            methods:'GET',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error()
            }
        }).then((data)=>{
            if(data.loggedIn){
                window.location.assign('/login');
            
            }else{
            this.setState({
                isLoading:false,
                username:data.user,
                requests:data.requests
            })
        }
        }).catch((e)=>{
            
            this.setState({
                isLoading:false,
                error:'ERROR... while processing the request'
            })
        })
    }
    
    submit(event){
        var name = event.target.name;
        var username = name.split(':')[0];
        var request = name.split(':')[1];
        var choice = name.split(':')[2];
        var k= name.split(':')[3];
        var noti = this.state.requests;
            noti.splice(k,1);
            this.setState({
                requests:noti
            })
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/user/${username}/${request}/${choice}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include'
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error()
            }
        }).then((data)=>{
            
        }).catch((e)=>{
            this.setState({
                error:'ERROR... WHILE PROCESSING'
            })
        })
    }

    render(){
        var requests=[];
        var k=-1;
        if(this.state.requests){
            requests = this.state.requests.map((request)=>{
                var id=request.id;
                k++;
               return(
                   <div key={id} className='requests_request'>
                       <p>{request.request}</p>
                       <button name={`${window.location.href.split('profile/')[1].split('/')[0]}:${id}:accept:${k}`} onClick={this.submit}>accept</button>
                       <button name={`${window.location.href.split('profile/')[1].split('/')[0]}:${id}:reject:${k}`} onClick={this.submit}>reject</button>
                   </div>
               ) 
            })
        }

        return(
            <div>
                {this.state.isLoading?<p>LOADING....</p>:
                  <div>
                      {this.state.error?<p>{this.state.error}</p>:
                      <div className='main_body'>
                          <Header className='header' username={this.state.username}></Header>
                          <div className='body center'>
                          <div className='request'>
                              {this.state.requests.length>0?<div>{requests}</div>:<p>No requests</p>}
                           </div></div>
                      </div>
                      }
                  </div>
                }
            </div>
        )
    }
}

export default UserRequests