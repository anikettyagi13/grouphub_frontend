import React from 'react';
import Header from './Header';

class CreateGroup extends React.Component{
    constructor(){
        super();
        this.state={
            username:'',
            groupname:'',
            isLoading:true,
            error:'',
            username1:'',
            username2:'',
            username3:'',
            groupnames:''
        }
        this.submit=this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/create_group',{
            credentials:'include'
        }).then((response)=>{
            if(response.ok){
                return response.json()
            }
        }).then((data)=>{
            if(data.loggedIn){
                window.location.assign('/login');
            }else{

                this.setState({
                    isLoading:false,
                    groupnames:data.groupnames,
                    username:data.username
                })
            }
        })
    }
    handleChange(event){
        const name= event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        this.setState({
            isLoading:true
        })
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/create_group',{
            credentials:'include',
            method:'POST',
            body:JSON.stringify(this.state),
            headers:{
                'Content-Type':'application/json'
            },
            mode:'cors'
        }).then((res)=>{
            if(res.ok){
                window.location.assign(`/group/${this.state.groupname}`);
            }else{
                return res.json()
            }
        }).then((res)=>{
            if(res.error){
                this.setState({
                    groupname:'',
                    isLoading:false,
                    error:res.error,
                    username1:'',
                    username2:'',
                    username3:'',
                });
            }else if(res.keyPattern){
                this.setState({
                    groupname:'',
                    isLoading:false,
                    error:'groupname is taken...',
                    username1:'',
                    username2:'',
                    username3:'',
                })
            }
        })
    }
    render(){
        var groupname=[];
        if(this.state.groupnames){
            groupname=this.state.groupnames.map((groupname)=>{
                return(
                    <div key={groupname}className='groupname_link'>
                        <span><a href={`group/${groupname}` }>{groupname}</a></span>
                    </div>
                )    
            })
        }
        return(
            <div>
                {this.state.isLoading?<p>LOADING...</p>:
                <div className='main_body'>
                <Header className='header' username={this.state.username}/>
                <div className='body'>
                <span className='material'>You will be made the leader of the group. The leader of the group could not change. Every group has three council of leaders.</span>
                    <div className='login_page page1'>
                        <h1>CREATE GROUP</h1>
                {this.state.error?<p><span className='error'>{this.state.error}</span></p>:null}
                <label className='material'>GROUPNAME</label><br></br>
                <input type="text" placeholder='groupname'name="groupname" onChange={this.handleChange} value={this.state.groupname}/>
                <br />
                <br/>
                <label className='material'>COUNCIL OF LEADER -:1</label><br></br>
                <input type="text"placeholder='council of leader 1' name="username1" onChange={this.handleChange} value={this.state.username1}/>
                <br />
                 <label className='material'>COUNCIL OF LEADER -:2</label><br></br>
                <input type="text"placeholder='council of leader 2' name="username2" onChange={this.handleChange} value={this.state.username2}/>
                <br />
                 <label className='material'>COUNCIL OF LEADER -:3</label><br></br>
                <input type="text"placeholder='council of leader 3' name="username3" onChange={this.handleChange} value={this.state.username3}/>
                <br />
                <button onClick={this.submit} className='material'>MAKE GROUP</button>
                </div>
                <div className='info'>
                </div>
                </div>
                <div className='group'>
                    <h4>GROUPNAME</h4>
                    {groupname}
                </div>
         
                </div>
            }
            </div>
        )
    }
}

export default CreateGroup