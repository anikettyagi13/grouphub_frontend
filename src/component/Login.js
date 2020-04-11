import React from 'react';
class Login extends React.Component{
    constructor(){
        super();
        this.state={
            email:'',
            password:'',
            error:''
        }
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event){
        var name = event.target.name;
        this.setState({
            [name]:event.target.value
        })
    }
    submit(event){
        event.preventDefault();
        const {email,password} = this.state;
        fetch('https://anikettyagi-api-grouphub.herokuapp.com/api/login',{
            method:'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials':'true'
            },
            body:JSON.stringify(this.state),
            credentials: 'include',
            mode:'cors'
            // credentials:'include'
        }).then((respo)=>{
            if(respo.ok){
                window.location.assign('/home');
            }else{
                var error= 'wrong credentials'
                this.setState({
                    email:'',
                    password:'',
                    error
                })
            }
            
        })
    }

    render(){
        return(
            <div className='login_page'>
                <h1> LOGIN </h1>
                {this.state.error?<span className='error'>{this.state.error}</span>:null}
                <br></br>
                <br />
                <label className="material">
                    EMAIL:
                </label>
                <br/>
                <input name="email" type="email" value={this.state.email} placeholder='email' onChange={this.handleChange} />
                <br></br>
                <label className='material'>PASSWORD:</label>
                <br></br>
                <input name="password" type="password" placeholder='password' onChange={this.handleChange} value={this.state.password} />
                <br></br>
                {/* <input type="submit" onClick={this.submit}></input> */}
                <br></br>
                <button className='material' onClick={this.submit}>SUBMIT</button>
                <br />
                <a href="/signup" className='link'>SIGNUP</a>
            </div>
        )
    }
}

export default Login;