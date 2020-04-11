import React from 'react';
import Header from './Header';

class Profile extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            contributions:0,
            username:'',
            groupnames:'',
            followers:'',
            following:'',
            request:'',
            posts:[],
            members:'',
            error:'',
            requests:''
        }
        this.logout = this.logout.bind(this);
        // this.scroll = this.scroll.bind(this);
        this.request = this.request.bind(this);
        this.increase = this.increase.bind(this);
    }

    componentDidMount(){
        window.addEventListener('scroll',this.scroll)
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split('profile/')[1]}`,{
            credentials:'include',
            }).then((response)=>{
            return response.json();
        }).then((response)=>{
            if(response.loggedIn){
                window.location.assign('/login');
            }else{
            if(response.user.requests){
                this.setState({
                    isLoading:false,
                    username:response.username,
                    groupnames:response.groupnames,
                    followers:response.user.followers,
                    following:response.user.following,
                    members:response.user.members,
                    posts:response.post,
                    contributions:response.user.contributions,
                    requests:response.user.requests,
                })
            }
            else if(!response.request){
                this.setState({
                    contributions:response.user.contributions,
                    groupnames:response.groupnames,
                    isLoading:false,
                    username:response.username,
                    followers:response.user.followers,
                    following:response.user.following,
                    members:response.user.members,
                    posts:response.post
                })
            }else{
                this.setState({
                    isLoading:false,
                    username:response.username,
                    followers:response.user.followers,
                    groupnames:response.groupnames,
                    following:response.user.following,
                    contributions:response.user.contributions,
                    members:response.user.members,
                    request:response.request
                })
            }
        }
    }
    )


    }

    // scroll(event){
    //     if(window.screen)
    // }

    request(event){
        if(this.state.request=='request'){

                this.setState({
                    request:'requested'
                })
               fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/profile/${window.location.href.split('profile/')[1].split('/')[0]}/request`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((res)=>{
                if(res.ok){
                    return res.json();
                }else{
                    throw new Error();
                }
            }).then((data)=>{
            }).catch((e)=>{
                
                this.setState({
                    error:'ERROR... while handling the request'
                })
            })
        }
    }
    increase(event){
        event.preventDefault();
        var name = event.currentTarget.name;
        var post = name.split(':')[0];
        var applaused =name.split(':')[1];
        var k = name.split(':')[2];
        
        if(applaused=="applause"){
            var posts =this.state.posts;
        posts[k].applaused = 'applaused' ;
        posts[k].applause +=1;
        this.setState({
            posts:posts
        })
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/${window.location.href.split('profile/')[1]}/post/${post}/increase`,{
            method:'GET',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error()
            }
        }).then((data)=>{
        }).catch((e)=>{
            this.setState({
                error:'ERROR...while processing request'
            })
        })
    }
    }
    logout(){
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/logout').then((res)=>{
            if(!res.ok){
                this.setState({
                    error:'ERROR...while processing request'
                })
            }
        })
    }
    render(){
        var posts=[];
        var groupname=[];
        if(!this.state.isLoading){
            if(this.state.posts){
                var k=-1;
                posts = this.state.posts.map((post)=>{
                   k++;
                   var namek=`${post._id}:${post.applaused}:${k}`
                   var applause=post.applaused=='applause'?<p>applause</p>:<p>applaused</p>
                    var href=`/profile/${window.location.href.split('profile/')[1]}/${post._id}`
                return(<div key={post._id} className='post'>
                <div>
                    <div className='username'>
                    <p><a>{window.location.href.split('profile/')[1]}</a></p>
                    </div>
                    <br></br>
                    <div className='post_body'>
                        <p>{post.post}</p>
                    </div>
                    <button className='applause' onClick={this.increase}name={`${post._id}:${post.applaused}:${k}:${post.username}`}>{post.applaused}</button>-{post.applause}
                    <a href={`/profile/${window.location.href.split('profile/')[1]}/${post._id}`} className='comment_link'>comment</a>
                </div>
            </div>)
                
                })
            }
        
    }
    
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
        <div>{this.state.isLoading?<p className='material'>LOADING....</p>:
        <div>
            {this.state.error?<p className='error'>{this.state.error}</p>:
        <div className='main_body'>
            <Header username={this.state.username} className='header'></Header>
        <div className='body body1'>
            <div>
            <div className='user_info'>
                <span className='card'><br></br><span className='material'><a className='material' href={`/profile/${window.location.href.split('profile/')[1]}/followers`}>followers</a><br></br><br></br>{this.state.followers}</span></span>   
                <span className='card'><br></br><span className='material'><a className='material' href={`/profile/${window.location.href.split('profile/')[1]}/following`}>following</a><br></br><br></br>{this.state.following}</span></span>  
                <span className='card'><br></br><span className='material'><a className='material' href={`/profile/${window.location.href.split('profile/')[1]}/group`}>members</a><br></br><br></br>{this.state.members}</span></span>  
                <span className='card'><br></br><span className='material'>contributions<br></br><br></br>{this.state.contributions}</span></span>
                </div></div>
            {this.state.requests?
            <div>
            <a href="/post" className='material'>POST</a>
            <a href='/login' className='material' onClick={this.logout}>LOGOUT</a>
            </div>
            :null}
            {this.state.request?<button onClick={this.request} className='posting_button'>{this.state.request}</button>:
            <div>
            <div>
                <p>{this.state.user}</p>
                <div >{posts}</div>
            </div>
            </div>
            } 
            </div>
            <div className='group'>
            <h4>GROUPNAME</h4>
            {groupname}
            </div>
            </div>
            }</div>
        }</div>
        )
    }
    

}

export default Profile; 

// <img src="https://img.icons8.com/dotty/24/000000/bell.png"/>