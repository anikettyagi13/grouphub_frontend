import React from 'react';
import Header from './Header';

class Following extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            usernames:'',
            error:'',
            username:''
        }
    }

    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split('profile/')[1].split('/')[0]}/following`,{
            method:'GET',
            credentials:'include'
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error();
            }
        }).then((data)=>{
            if(data.loggedIn){
                window.location.assign('/login');
            }else{this.setState({
                isLoading:false,
                usernames:data.usernames,
                username:data.username
            })
        }
        }).catch((e)=>{
            
            this.setState({
                isLoading:false,
                error:true
            })
        })
    }

    render(){
        var username=[];
        if(this.state.usernames){
            username=this.state.usernames.map((username)=>{
                return(
                    <div key={username} className='groupname_link requests_request'>
                       <a href={`/profile/${username}`}>{username}</a> 
                    </div>
                )
            })
        }
        return(
            <div>
                {this.state.isLoading?<p className='material'>LOADING...</p>:
                <div>
                    {this.state.error?<p className='error'>UNAUTHORIZED</p>:
                    <div>
                        <div className='main_body'>
                            <Header username={this.state.username} className='header'></Header>
                            <div className='body request'>
                                <h1 className='material'>FOLLOWING</h1>
                                <div>
                                    {username}
                                </div>
                            </div>
                        </div>                        
                    </div>}
                </div>}
            </div>
        )
    }
}

export default Following;