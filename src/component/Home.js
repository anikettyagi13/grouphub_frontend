import React from 'react';
import Header from './Header';

class Home extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            error:'',
            empty:'',
            username:'',
            posts:[],
            limit:1,
            groupnames:'',
            loadingPost:false,
            notMore:false,
            noElements:0
        }
        this.increase = this.increase.bind(this);
        this.scroll = this.scroll.bind(this);
    }
    componentDidMount(){
        var limit=this.state.limit;
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/home`,{
            method:'POST',
            credentials:'include',
            body:JSON.stringify({limit}),
            headers:{
                'Content-Type':'application/json'
            },
            cache:'no-cache'
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error();
            }
        }).then((data)=>{
            var posts = this.state.posts;
            posts.push(...data.posts);
            if(data.posts.length>0||this.state.limit===1){
                this.setState({
                    isLoading:false,
                    posts:posts,
                    username:data.username,
                    groupnames:data.groupnames
                },()=>{
                    if(this.state.posts.length<6){
                        this.state.limit+=1;
                        if(this.state.limit===5){
                            this.state.notMore=true;
                        }
                        this.componentDidMount();
                    }
                })
            }else{
                if(this.state.limit===5){
                    this.setState({
                        notMore:true
                    })
                }
                this.state.limit+=1;
                this.componentDidMount();
            }
            
        }).catch(()=>{
            this.setState({
                error:'ERROR... while handling the request'
            })
        })
    }
    increase(event){
        var name = event.currentTarget.name;
        var id= name.split(':')[0];
        var applaused = name.split(':')[1];
        var k = name.split(':')[2];
        var username = name.split(':')[3]
        if(applaused=='applause'){
            var posts =this.state.posts;
        posts[k].applaused = 'applaused';
        posts[k].applause +=1;
        this.setState({
            posts:posts
        });
            if(name.split(':')[4]){
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${name.split(':')[4]}/${id}/increase`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((res)=>{
                if(res.ok){
                    var posts=this.state.posts;
                    posts[k].applause+=1;
                    posts[k].applaused='applaused'
                    this.setState({
                        posts
                    })
                }else{
                    this.setState({
                        error:'ERROR.. in handling the problem'
                    })
                }
            })
            }else{
                fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/${username}/post/${id}/increase`,{
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
    }
    posts(){
        var limit=this.state.limit;
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/home`,{
            method:'POST',
            credentials:'include',
            body:JSON.stringify({limit}),
            headers:{
                'Content-Type':'application/json'
            },
            cache:'no-cache'
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error();
            }
        }).then((data)=>{
            if(data.posts.length>0){
                var posts = this.state.posts;
                posts.push(...data.posts)
            this.setState({
                loadingPost:false,
                posts:posts
            })
            }else{
                this.state.noElements+=1;
                if(this.state.noElements===10){
                    this.setState({
                        notMore:true
                    })
                }
            }
        }).catch(()=>{
            this.setState({
                error:'ERROR... while handling the request'
            })
        })
    }

    scroll(event){
        var body= document.getElementsByClassName('body1')[0];
        if(body.scrollHeight<(body.scrollTop+(window.innerHeight*(window.innerHeight/body.offsetHeight))-30)){
            if(!this.state.notMore){
            this.state.limit+=1;
            this.posts();
            }
        }
        if(window.screen.availHeight>body.scrollHeight){
             if(!this.state.notMore){
                this.state.limit+=1;
                this.posts();
             }
        }
    }
    componentDidUpdate(){
        if(document.getElementsByClassName('body1')[0]){
            document.getElementsByClassName('body1')[0].addEventListener('scroll',this.scroll);
        }
    }

    render(){
        var groupname=[];
        var posts=[]
        if(this.state.posts){
            var k=-1;
            posts=this.state.posts.map((post)=>{
                if(!post.groupname){
                k++;
                return(
                    <div key={post._id} className='post'>
                        <div>
                            <div className='username'>
                            <p><a href={`/profile/${post.username}`}>{post.username}</a></p>
                            </div>
                            <br></br>
                            <div className='post_body'>
                                <p>{post.post}</p>
                                </div><br></br>
                                <button className='applause' onClick={this.increase}name={`${post._id}:${post.applaused}:${k}:${post.username}`}>{post.applaused}</button>-{post.applause}
                                 <a href={`/profile/${post.username}/${post._id}` }className='comment_link'>comment</a>

                        </div>
                    </div>
                )
                }else{
                    k++;
                    return(
                        <div key={post._id} className='post'>
                            <div>
                                <h3><span className='groupname'><a href={`/group/${post.groupname}`}>{post.groupname}</a></span><br></br>
                                <p className='username'><a href={`/profile/${post.contributor}`}>{post.contributor}</a></p></h3>
                                <br></br>
                                <div className='post_body'>
                                    <p>{post.post}</p>
                                    </div>      <br></br>
                                    <button onClick={this.increase}name={`${post._id}:${post.applaused}:${k}:${post.username}:${post.groupname}`} className='applause'>{post.applaused}</button>-{post.applause}
                                    <a href={`/group/${post.groupname}/${post._id}/comments`} className='comment_link'>comment</a>
                            </div>
                        </div>
                    )   
                }
            });
        }
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
                <div>
                    {this.state.error?<p>{this.state.error}</p>:
                    <div className='main_body'>
                        <Header className='header' username={this.state.username}></Header>
                        <div className='body body1'>
                            <div>
                                <div>
                                   {posts}
                                </div>
                        {this.state.loadingPost?<p>loading...</p>:null}
                        {this.state.notMore?<p className='material'>viewed last 10 days post</p>:null}
                        </div>
                        </div>
                        <div className='group'>
                            <h4>GROUPNAME</h4>
                            {groupname}
                        </div>
                    </div>}
                </div>}
            </div>
        )
    }
}

export default Home