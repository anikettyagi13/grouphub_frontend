import React from 'react';
import {Switch,Route} from 'react-router-dom';
import Profile from './component/Profile';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Post from './component/Post';
import CreateGroup from './component/CreateGroup';
import GroupHome from './component/GroupHome';
import GroupNoti from './component/GroupNoti';
import GroupRequest from './component/GroupRequest';
import ContributionComments from './component/ContributionComments';
import UserRequests from './component/UserRequests'
import PostComment from './component/PostComment';
import Search from './component/Search';
import Home from './component/Home';
import Following from './component/Following';
import Follower from './component/Follower';
import Groups from './component/Groups';

const Main = ()=>{
    return(
        <Switch>
            <Route exact path='/home' component={Home}></Route>
            <Route exact path='/createGroup' component={CreateGroup}></Route>
            <Route exact path='/group/:groupname' component={GroupHome}></Route>
            <Route exact path="/signup" component={SignUp}></Route>
            <Route exact path='/group/:groupname/:contribution/comments' component={ContributionComments}></Route>
            <Route exact path='/group/:groupname/notification' component={GroupNoti}></Route>
            <Route exact path='/group/:groupname/memberrequest' component={GroupRequest}></Route>
            <Route exact path="/post" component={Post}></Route>
            <Route exact path='/profile/:username' component={Profile}></Route>
            <Route exact path='/profile/:username/requests' component={UserRequests}></Route>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/search' component={Search}></Route>
            <Route exact path='/profile/:username/following' component={Following}></Route>
            <Route exact path='/profile/:username/followers' component={Follower}></Route>
            <Route exact path='/profile/:username/group' component={Groups}></Route>
            <Route exact path="/profile/:username/:id" component={PostComment}></Route>
        </Switch>
    )
}

export default Main