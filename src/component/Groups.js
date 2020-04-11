import React from 'react';
import Header from './Header';

class Groups extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            groupnames:'',
            error:'',
            username:''
        }
    }

    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split('profile/')[1].split('/')[0]}/groups`,{
            method:'GET',
            credentials:'include'
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error();
            }
        }).then((data)=>{
            this.setState({
                isLoading:false,
                groupnames:data.groupnames,
                username:data.username
            })
        }).catch((e)=>{
            this.setState({
                isLoading:false,
                error:true
            })
        })
    }

    render(){
        var groupname=[];
        if(this.state.groupnames){
            groupname=this.state.groupnames.map((username)=>{
                return(
                    <div key={username} className='groupname_link requests_request'>
                       <a href={`/group/${username}`}>{username}</a> 
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
                                <h1 className='material'>GROUPS</h1>
                                <div>
                                    {groupname}
                                </div>
                            </div>
                        </div>                        
                    </div>}
                </div>}
            </div>
        )
    }
}

export default Groups;