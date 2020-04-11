import React from 'react';
import Header from './Header';

class ContributionComments extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            comments:[],
            contribution:'',
            error:'',
            comment:'',
            username:'',
            groupnames:[]
        }
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.increase = this.increase.bind(this)
    }
    componentDidMount(){
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split("group/")[1].split("/")[0]}/${window.location.href.split('group/')[1].split('/')[1]}/comments`,{
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
                    username:data.username,
                    contribution:data.contribution,
                    groupnames:data.groupnames,
                    comments:data.comments
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
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split("group/")[1].split("/")[0]}/${window.location.href.split('group/')[1].split('/')[1]}/comments`,{
            method:"POST",
            credentials:'include',
            body:JSON.stringify(this.state),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            if(res.ok){
                window.location.assign(`/group/${window.location.href.split("group/")[1].split("/")[0]}/${window.location.href.split('group/')[1].split('/')[1]}/comments`);
            }else{
                this.setState({
                    error:'unable to comment'
                })
            }
        })
    }
    }
    increase(event){
        var name = event.currentTarget.name;
        var comment = name.split(':')[0];
        var applause = name.split(':')[1];
        var k = name.split(':')[2];
        if(applause=='applause'){
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split('group/')[1].split('/')[0]}/${window.location.href.split('group/')[1].split('/')[1]}/${comment}/increase`,{
                 method:'GET',
                 credentials:'include',
                 headers:{
                     'Content-Type':'application/json'
                 }
            }).then((res)=>{
                if(res.ok){
                    var comments = this.state.comments;
                    comments[k].applause+=1;
                    comments[k].applaused='applaused';
                    this.setState({
                        comments:comments
                    })
                }else{
                    throw new Error();
                }
            }).catch((e)=>{
                this.setState({
                    error:'ERROR.. couldnot handle request '
                })
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
                    <div key={comment._id} className='comment_comment'>
                        <p><a href={`/profile/${comment.writer}`} className='material'>{comment.writer}</a>
                        <br></br>
                        {comment.comment}     
                        <br></br>
                        <br></br>
                <button onClick={this.increase} className='applause' name={`${comment._id}:${comment.applaused}:${k}`}>{comment.applaused}</button> -:  <span>{comment.applause}</span></p>
                    </div>
                )
            })
        }if(this.state.groupnames){
            groupname=this.state.groupnames.map((groupname)=>{
                return(
                    <div key={groupname}className='groupname_link'>
                        <span><a href={`/group/${groupname}` }>{groupname}</a></span>
                    </div>
                )    
            })
        }
        return(
            <div>
                {this.state.isLoading?<p>LOADING...</p>:
                <div className='main_body'>
                    <Header username={this.state.username} className='header'></Header>
                <div className='body'>
                    <div>
                <div>{this.state.error?<p>{this.state.error}</p>:
                <div>
                    <div className='post'>
                        <div className='username'><p>{window.location.href.split('group/')[1].split('/')[0]}</p></div>
                        <div className='post_body'>{this.state.contribution}</div>
                    <div className='comment'>
                    <div>{comments}</div>
                    </div>
                    <br></br>
                    <input required type="text" name="comment" placeholder='type comment here :)' onChange={this.handleChange} className='comment_input' value={this.state.comment}></input>
                    <button onClick={this.submit} className='comment_button material' >COMMENT</button>
                    </div> 
                
                </div>
            }</div>
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

export default ContributionComments

