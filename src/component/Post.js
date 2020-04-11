import React from 'react';
import Header from './Header'
class Post extends React.Component{
    constructor(){
        super();
        this.state={
            post:'',
            error:'',
            groupnames:'',
            isloading:true,
            username:''
        }
        this.handleChange=this.handleChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentDidMount(){
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/post',{
            // method:"GET",
            credentials:'include',
            // headers:{
            //     'Access-Control-Allow-Origin': '*',
            //     'Access-Control-Allow-Credentials':'true'
            // },
            // mode:"cors"
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                window.location.assign('/login');
            }
        }).then((data)=>{
            this.setState({
                isloading:false,
                username:data.username,
                groupnames:data.groupnames
            })
        })
    }
    handleChange(event){
        var name= event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/post',{
            method:"POST",
            body:JSON.stringify(this.state),
            headers:{
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':'true'
            },
            credentials:"include",
            mode:"cors"
        }).then((response)=>{
            if(response.ok){
                window.location.assign('/home');
            }else{
                this.setState({
                    post:'',
                    error:"Enable to post"
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
                        <span><a href={`/group/${groupname}` }>{groupname}</a></span>
                    </div>
                )    
            })
        }
        return(
            <div>{this.state.isloading?<p>LOADING...</p>:
                <div>
                <span>{this.state.error?<span>{this.state.error}</span>:null}</span>
                <div className='main_body'>
                    <Header className='header' username={this.state.username}></Header>
                    <div className='body'>
                        <div className='posting'>
                            <textarea placeholder='START TYPING HERE' className='posting_post postin' rows='25' cols="100" name="post" onChange={this.handleChange} value={this.state.post} />
                            <br />
                            <button onClick={this.submit} className='posting_button'>POST</button>
                        </div>
                    </div>
                    <div className='group'>
                    <h4>GROUPNAME</h4>
                    {groupname}
                    </div>
                </div>
                </div>
                }
            </div>
        )
    }
}

export default Post;