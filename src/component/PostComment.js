import React from 'react';
import Header from './Header';

class PostComments extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            comments:[],
            post:'',
            applause:'',
            owner:'',
            error:'',
            comment:''
        }
        this.increase = this.increase.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split("profile/")[1].split("/")[0]}/${window.location.href.split('profile/')[1].split('/')[1]}/comments`,{
            method:"GET",
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                this.setState({
                    isLoading:false,
                    error:'UNAUTHORIZED'
                })
            }
        }).then((data)=>{
            if(data){
                this.setState({
                    isLoading:false,
                    post:data.data.post,
                    groupnames:data.data.groupnames,
                    comments:data.data.comments,
                    applause:data.data.applause,
                    owner:data.data.owner
                })
            }
        })
    }
    handleChange(event){
        var name = event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        if(this.state.comment){
        
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split("profile/")[1].split("/")[0]}/${window.location.href.split('profile/')[1].split('/')[1]}/comments`,{
            method:"POST",
            credentials:'include',
            body:JSON.stringify(this.state),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            if(res.ok){
                window.location.assign(`/profile/${window.location.href.split("profile/")[1].split("/")[0]}/${window.location.href.split('profile/')[1].split('/')[1]}`);
            }else{
                this.setState({
                    error:'unable to comment'
                })
            }
        })
    }
    }
    increase(event){
        event.preventDefault();
        var name = event.currentTarget.name;
        var comment = name.split(':')[0];
        var applaused = name.split(':')[1];
        var k = name.split(':')[2];
        if(applaused=='applause'){
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split("profile/")[1].split("/")[0]}/${window.location.href.split('profile/')[1].split('/')[1]}/${comment}/increase`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((res)=>{
                if(res.ok){
                    var comments = this.state.comments
                    comments[k].applause+=1;
                    comments[k].applaused='applaused'
                    this.setState({
                        comments
                    })
                }else{
                    this.setState({
                        error:'Error.. while processing request'
                    })
                }
            })
        }
    }
    render(){
        var comments=[];
        var groupname=[];
        if(this.state.comments){
            var k=-1;
            comments = this.state.comments.map((comment)=>{
                k++;
                return(
                    <div key={comment._id} className="comment_comment">
                        <p>{comment.writer}-:{comment.comment}
                        <br></br>   
                        <br></br>
                        <button onClick={this.increase} className='applause' name={`${comment._id}:${comment.applaused}:${k}`}>{comment.applaused}</button> -:  <span>{comment.applause}</span>
                        </p>
                    </div>
                )
            })
        }        if(this.state.groupnames){
            groupname=this.state.groupnames.map((groupname)=>{
                return(
                    <div key={groupname}className='groupname_link'>
                        <span><a href={`/group/${groupname}` }>{groupname}</a></span>
                    </div>
                )    
            })
        }

        var href=`/profile/${window.location.href.split("profile/")[1].split("/")[0]}`
        return(
            <div>
                {this.state.isLoading?<p className='material'>LOADING...</p>:
                
                <div className='main_body'>
                    <Header className='header'></Header>
                    <div className='body'> 
                    <div className='post_comment'>
                        <div>
                <div className='error'>{this.state.error?<p>{this.state.error}</p>:
                <div className='post'>
                    {this.state.owner}
                <p className='post_body'>{this.state.post}</p>
                <p>applause-:{this.state.applause}</p>
                    <div>{this.state.contribution}</div>
                    <div className='comment'>
                    <div>{comments}</div>
                    </div><br></br>
                    <input type="text" required name="comment" placeholder='type comment here :)' onChange={this.handleChange} className='comment_input' value={this.state.comment}></input>
                    <button onClick={this.submit} className='comment_button material' >COMMENT</button>
                </div>
            }</div>
            </div>
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

export default PostComments