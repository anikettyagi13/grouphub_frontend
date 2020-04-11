import React from 'react';

function Header(props){
    return(
        <nav id='nav'>
            <ul>
                {window.location.href.split('3000/')[1]=='home'?
                <img src="https://img.icons8.com/material-rounded/24/000000/home.png"/>:
                <a href='/home'><img className='icon'src="https://img.icons8.com/material-outlined/24/000000/home--v2.png"/></a>
                }
                {window.location.href.split('3000/')[1]=='createGroup'?
                <img src="https://img.icons8.com/material/24/000000/google-groups.png"/>    
                :
                <a href={`/createGroup`}><img src="https://img.icons8.com/windows/24/000000/google-groups.png"/></a>
                }
                <a href={`/profile/${props.username}/requests`}><img src="https://img.icons8.com/metro/24/000000/contract.png"/></a>
                {window.location.href.split('3000/')[1]==`profile/${props.username}`?
                <img src="https://img.icons8.com/ios-filled/24/000000/login-as-user.png"/>
                 :
                 <a href={`/profile/${props.username}`}><img src="https://img.icons8.com/ios/24/000000/login-as-user.png"/></a>
                 }
                 {window.location.href.split('3000/')[1]=='post'?
                 <img src="https://img.icons8.com/ios-filled/24/000000/add.png"/>
                 :
                 <a href={`/post`}><img src="https://img.icons8.com/ios/24/000000/add.png"/></a>}
                {window.location.href.split('3000/')[1]=='search'?
                <img src="https://img.icons8.com/ios-filled/24/000000/search-more.png"/>
                :
                <a href={`/search`}><img src="https://img.icons8.com/ios/24/000000/search-more.png"/></a>
                }
                
            </ul>
        </nav>

    )
}

export default Header;