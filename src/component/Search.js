import React from 'react';
import openSocket from 'socket.io-client';
import Header from './Header'
const socket = openSocket('https://anikettyagi-api-grouphub.herokuapp.com');

class Search extends React.Component{
    constructor(){
        super()
        this.state={
            isLoading:true,
            userLoading:false,
            user:'',
            group:'',
            username:'',
            groupnames:'',
            userButton:true,
            groupButton:false,
            users:[],
            groups:[],
        }
        this.change=this.change.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }
    componentDidMount(){
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/search',{
            credentials:'include'
        }).then((data)=>{
            if(data.ok){
            return data.json();
            }
        }).then((res)=>{
            if(res.loggedIn){
                window.location.assign('/login');
            }else{
            this.setState({
                isLoading:false,
                groupnames:res.groupnames,
                username:res.username
            })
        }
        })
    }
    change(event){
        if(event.target.name=='userButton'){
            this.setState({
                groups:[],
                userButton:true,
                groupButton:false
            })
        }else{
            this.setState({
                users:[],
                userButton:false,
                groupButton:true
            })
        }
    }
    handleChange(event){
        var name=event.target.name;
        if(name=="user"){
            this.setState({
                userLoading:true,
                user:event.target.value
            })
            var user =event.target.value;
            socket.emit("Searchuser",user)
            socket.on('searchUser',(users)=>{
                this.setState({
                    users:users,
                    userLoading:false
                })
            })
        }else{
            this.setState({
                userLoading:true,
                group:event.target.value
            })
            socket.emit("Searchgroup",event.target.value)
            socket.on('searchGroup',(groups)=>{
                this.setState({
                    groups:groups,
                    userLoading:false
                })
            })
        }
    }


    render(){
        var groups=[];
        var users=[];
        if(this.state.userButton){
            users=this.state.users.map((user)=>{
                return(
                    <div key={user}>
                        <a href={`/profile/${user}`}>{user}</a>
                    </div>
                )
            })
        }else{
            groups=this.state.groups.map((group)=>{
                return(
                    <div key={group}>
                        <a href={`/group/${group}`}>{group}</a>
                    </div>
                )
            })
        }

        return(
        <div>{this.state.isLoading?<p className='material'>LOADING...</p>:
            <div className='main_body'>
                <Header className='header' username={this.state.username}/>
               <div className='body center'>
                   <button name="userButton" className='search_button' onClick={this.change}>Search user</button>      <button className='search_button' name="groupButton" onClick={this.change}>Search group</button>
                    {this.state.userButton?
                    <div>
                        <input name="user" type="text" placeholder=" Search user" value={this.state.user} onChange={this.handleChange}></input>
                        {this.state.userLoading?<p className='material'>LOADING...</p>:
                            <div className='searched'>{users}</div>
                        }
                    </div>               
                :
                    <div>
                        <input name="group" type="text" placeholder="group" value={this.state.group} onChange={this.handleChange}></input>
                        {this.state.userLoading?<p className='material'>LOADING...</p>:
                            <div className='searched' >{groups}</div>
                        }
                    </div>
                }
                </div>
            </div>
            }</div>
        )
    }
}

export default Search