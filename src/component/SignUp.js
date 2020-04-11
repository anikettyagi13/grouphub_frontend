import React from 'react';

class SignUp extends React.Component{
    constructor(){
        super();
        this.state={
            username:'',
            email:'',
            password:'',
            error:''
        }
        this.handleChange= this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(event){
        var name=event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/create_user',{
            method:"POST",
            headers:{
                "Content-type":'application/json'
            },
            body:JSON.stringify(this.state),
            credentials:'include',
            mode:'cors'
        }).then((response)=>{
            if(response.ok){
                window.location.assign('/home');
            }else{
                var data = response.json();
                return data;
            }
        }).then((data)=>{
            var error;
            if(data.message){
                error = data.message.split(':')[2];
                this.setState({
                    username:'',
                    password:'',
                    email:'',
                    error:error
                })
            }else if(data.keyValue){
                
                for(var i in data.keyValue){
                    error= i;
                    break;
                }
                error=`${error} is taken`;
                this.setState({
                    username:'',
                    password:'',
                    email:'',
                    error:error
                })
            }
        })
    }

    render(){
        return(
            <div className='login_page'>
                <h1>SIGNUP</h1>
                {this.state.error?<span className='error'>{this.state.error}</span>:null}
                <br />
                <label className='material'>USERNAME</label>
                <br></br>
                <input name="username" type="text"required={true} placeholder='username' onChange={this.handleChange} value={this.state.username}/>
                <br/>
                <label className='material'>EMAIL</label>
                <br/>
                <input name="email" type="email" required={true} placeholder='email' onChange={this.handleChange} value={this.state.email}/>
                <br />
                <label className='material'>PASSWORD</label>
                <br />
                <input name="password" type="password" placeholder='password' required={true}onChange={this.handleChange} value={this.state.password}/>
                {/* <br></br> */}
                <br></br>
                <button className='material' onClick={this.submit}>SUBMIT</button>
                <br></br>
                <a className='link' href='/login'>LOGIN</a>
            </div>
        )
    }
}

export default SignUp