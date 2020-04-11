import React from 'react';
import Header from './Header';

class GroupHome extends React.Component{
    constructor(){
        super();
        this.state={
            isLoading:true,
            noOfNotification:0,
            leader:'',
            contributions:[],
            newContribution:'',
            groupnames:'',
            request:false,
            requests:0,
            requested:'request',
            username:'',
            limit:10,
            notMore:false
        }
        this.loadMore=this.loadMore.bind(this);
        this.increase =this.increase.bind(this)
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.request = this.request.bind(this);
    }
    componentDidMount(){
        const url = window.location.href;
        const groupname = url.split('group/')[1];
        var limit=this.state.limit
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${groupname}`,{
            method:"POST",
            credentials:'include',
            body:JSON.stringify({limit}),
            headers:{
                "Content-Type":"application/json"
            },
            mode:'cors'
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error("can't process request")
            }
        }).then((data)=>{
            if(data.member){
            if(data.data.noOfNotification>=0){
                this.setState({
                    group:data.data.group,
                    leader:data.data.leader,
                    contributions:data.data.contributions,
                    isLoading:false,
                    requests:data.data.requests,
                    noOfNotification:data.data.noOfNotification,
                    request:false,
                    username:data.username,
                    groupnames:data.groupnames
                })
            }else{    
            this.setState({
                group:data.data.group,
                username:data.username,
                groupnames:data.groupnames,
                leader:data.data.leader,
                contributions:data.data.contributions,
                isLoading:false,
                request:false
            })
            }
        }else{
            this.setState({
                group:data.data.group,
                username:data.username,
                groupnames:data.groupnames,
                leader:data.data.leader,
                isLoading:false,
                request:true
            })
            if(data.data.requested){
                this.setState({
                    requested:'requested',
                    groupnames:data.groupnames
                })
            }
        }
        }).catch((e)=>{
            this.setState({
                error:e
            })
        })
    }
    loadMore(event){
        var limit=this.state.limit+10;
        const url = window.location.href;
        const groupname = url.split('group/')[1];
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${groupname}`,{
            method:"POST",
            credentials:'include',
            body:JSON.stringify({limit}),
            headers:{
                "Content-Type":"application/json"
            },
            mode:'cors'
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error();
            }
        }).then((data)=>{
            if(this.state.contributions.length<data.data.contributions.length){
                this.setState({
                    contributions:data.data.contributions,
                    limit:limit
                   })
            }else{
                this.setState({
                    notMore:true
                })
            }
            
        }).catch((e)=>{
            this.setState({
                error:'ERROR... while handling request.'
            })
        })
    }
    increase(event){
        var name = event.currentTarget.name;
        var contribution = name.split(':')[0];
        var applause = name.split(':')[1];
        var k= name.split(':')[2];
        
        if(applause=='applause'){
            var contributions=this.state.contributions;
        contributions[k].applaused='applaused'
        contributions[k].applause+=1;
        this.setState({
            contributions
        })
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split('group/')[1].split('/')[0]}/${contribution}/increase`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((res)=>{
                if(res.ok){
                }else{
                    this.setState({
                        error:'ERROR.. in handling the problem'
                    })
                }
            })
        }
    }
    request(){
        if(this.state.requested=='request'){

            this.setState({
                requested:'requested'
            });
            fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/group/${window.location.href.split('group/')[1]}/request`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:'include'
        }).then((res)=>{
            if(res.ok){
                return res.json();
            }else{
                throw new Error();
            }
        }).then((data)=>{
        }).catch((e)=>{
            this.setState({
                error:'ERROR... were not able to request'
            })
        })
    }
    }
    handleChange(event){
        var name = event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        const url = window.location.href;
        const groupname = url.split('group/')[1];
        fetch(`https://anikettyagi-api-grouphub.herokuapp.com/api/${groupname}/create_contribution`,{
            method:"POST",
            credentials:"include",
            body:JSON.stringify(this.state),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            if(res.ok){
                return res.json()
            }else{
                this.setState({
                    error:"try again"
                })
            }
        }).then((data)=>{
            if(data.requsted){
                this.setState({
                    requested:true,
                    newContribution:'',
                },()=>{
                    alert('THANKS FOR YOUR CONTRIBUTION.Your post has been requested it will be posted after verification.')
                    window.location.assign(window.location.href)
                })
            }else{
                window.location.assign(window.location.href);
            }
        })
    }
    render(){
        var groupname=[];
        var contributions =[];
        if(this.state.contributions){
            var k=-1;
            contributions = this.state.contributions.map((contribution)=>{
                var href=`/group/${window.location.href.split('group/')[1]}/${contribution._id}/comments`;
                k++;
                return (<div key={contribution._id} className='post'>
                    <div>
                    <div className='username'>
                        <p><a href={`/profile/${contribution.owner}`}>{contribution.owner}</a></p>
                    </div>
                    <br></br>
                    <div className='post_body'>
                        <p>{contribution.contribution}</p>
                    </div>
                    <br></br>
                    <button onClick={this.increase} className='increase_button applause' name={`${contribution._id}:${contribution.applaused}:${k}`}>{contribution.applaused}</button> <span>{contribution.applause}</span>
                    <a href={href} className='comment_link'>comment</a>
                    <br />
                    </div>
                </div>)
            })
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
        const url= window.location.href.split('group/')[1];
        return(
            <div>
                {this.state.isLoading?<p className='material'>LOADING...</p>:
                <div className='main_body'>
                    <Header className='header' username={this.state.username} ></Header>
                    <div className='body body1'>
                    <div>
                        <div className='user_info'>
                        <span className='card'><br></br><span>members<br></br><br></br>{this.state.group.members.length}</span></span>  
                        <span className='card'><br></br><span>leader<br></br><br></br><a href={`/profile/${this.state.leader}`} className='comment_link'>{this.state.leader}</a></span></span>
                        </div>
                    {this.state.noOfNotification?<a href={`/group/${url}/notification`}className='comment_link'>Notification-:{this.state.noOfNotification}</a>:null}
                    {this.state.requests?<a href={`/group/${url}/memberrequest`} className='comment_link'>Requests-:{this.state.requests}</a>:null}
                    <div>{this.state.request?<button className='posting_button' onClick={this.request}>{this.state.requested}</button>:
                    <div>
                        <br></br>
                        <br></br>
                    <textarea name="newContribution" className='post_input' onChange={this.handleChange} value={this.state.newContributions} placeholder="START TYPING HERE"></textarea>
                    <br></br>
                    <button onClick={this.submit} className='posting_button'>POST</button>
                    <div>
                        <div>{contributions}</div>
                    </div>
                    <br></br>
                    {this.state.notMore?<p className='material'>veiwed all posts</p>:
                    <button onClick={this.loadMore} className='comment_button material' >LOAD MORE</button>                    
                    }
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

export default GroupHome;