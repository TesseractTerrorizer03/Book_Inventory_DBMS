import React,{ useState} from "react";
import './login.css';
import {redirectDocument, useNavigate} from 'react-router-dom';


import dbAnimation from "./doubt_animation.json";
import Lottie from "lottie-react";

const Login = () =>{
    const navigate= useNavigate();
    function redirect(){
        navigate("/purchase")
    }
    function redirect_user(){
        navigate("/topbooks")
    }
    const [userlog,setUserlog]=useState({
        email:"",
        password:"",
    });
    let name,value;
    const getUserData=(event)=>{
        name=event.target.name;
        value=event.target.value;
        setUserlog({ ...userlog,[name]:value});
     };
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

    return (
        <div className="full-div">
        <div className="heading-doubt-busters">BookStore Inventory</div>
        <meta charSet="utf-8" />
        <title>Portal Login</title>
        <style
            dangerouslySetInnerHTML={{
            __html:
                "\n        div.createaccount {\n          display: none;\n        }\n        button.loginbutton{\n            display: none;\n        }\n    "
            }}
        />
        <link rel="stylesheet" type="text/css" href="Style.css" />
        
        <div className="form_container" id="cont">
        <div className="animation-div">
              <Lottie animationData={dbAnimation}/>
              {/* <div className="animation-desc">LEt's end the doubts!</div> */}
        </div> 
            <div className="loginbox" id="loginbox">
                   
        
            <form className="l_form" id="lform" method="POST" action="">
                <h1 className="form_title1">Log in to your account</h1>
                <input
                className="input"
                name="email"
                type="text"
                autoComplete="off"
                placeholder="E-Mail"
                value={userlog.email}
                onChange={getUserData}
                // value={rollno}
                // onChange={e => setRollNo(e.target.value)}
                required
                />
                <input
                className="input"
                name="password"
                type="password"
                placeholder="Password"
                value={userlog.password}
                onChange={getUserData}
                // value={password}
                // onChange={e => setPassword(e.target.value)}
                required
                />
                <button type="submit" class="form_submit" onClick={redirect_user}>Log In as user </button>
                <button type="submit" class="form_submit" onClick={redirect}>Log In as admin </button>
                {/* <input
                type="submit"
                defaultValue="Login"
                className="form_submit"
                id="login-form-submit"
                // onClick={postData}
                // onClick={handleLogin}
                /> */}
            </form>
            <div className="options">
                <span>OR</span>
            </div>
            {/* <button class="acc"id="newacc" type="button" onClick="document.getElementById('loginbox').style.display='none';document.getElementById('account').style.display='block';document.getElementById('newacc').style.display='none';document.getElementById('log').style.display='block'">Create New account</button> */}
            <div className="account_div">
                Don't have an Account?{" "}
                {/* <button
                className="acc"
                id="newacc"
                type="button"
                onClick={document.getElementById('loginbox').style.display='none';document.getElementById('account').style.display='block';document.getElementById('newacc').style.display='none';document.getElementById('log').style.display='block'}
                >
                Create New account
                </button> */}
                <button
                className="acc"
                id="newacc"
                type="button"
                onClick={() => {
                    document.getElementById('loginbox').style.display = 'none';
                    document.getElementById('account').style.display = 'block';
                    document.getElementById('newacc').style.display = 'none';
                    document.getElementById('log').style.display = 'block';
                }}
                >
                Create New account
                </button>
                

            </div>
            {error && <div>{error}</div>}
          </div>
            <div className="createaccount" id="account">
            <form className="form" id="aform" method="POST" action="">
                <h1 className="form_title2">Create Account</h1>
                <input
                className="input"
                name="email"
                type="text"
                placeholder="Email ID"
                // value1={useracc.email}
                // onChange={getUserData1}
                required
                />
                <input
                className="input"
                name="rollno"
                type="text"
                placeholder="Roll Number"
                // value1={useracc.rollno}
                // onChange={getUserData1}
                required
                />
                <input
                className="input"
                name="pass"
                type="password"
                placeholder="Password"
                // value1={useracc.pass}
                // onChange={getUserData1}
                required
                />
                <button type="submit" className="acc_form" onClick={redirect}>Sign up as user</button>
                <button type="submit" class="acc_form" onClick={redirect}>Sign up as admin</button>
                {/* <input
                type="submit"
                defaultValue="Create"
                className="acc_form" //check if the input is to be changed to button type
                id="account-submit"
                // onClick={handleSignUp}
                /> */}
            </form>
            {/* <div class="account_div">Don't have an Account? <button class="acc"id="newacc" type="button" onclick="document.getElementById('loginbox').style.display='none';document.getElementById('account').style.display='block';document.getElementById('newacc').style.display='none';document.getElementById('log').style.display='block'">Create New account</button></div> */}
            <div className="back_login">
                Back to
                {/* <button
                className="loginbutton"
                id="log"
                type="button"
                onclick="document.getElementById('loginbox').style.display='block';document.getElementById('account').style.display='none';document.getElementById('newacc').style.display='block';document.getElementById('log').style.display='none'"
                >
                Login
                </button> */}
                <button
                className="loginbutton"
                id="log"
                type="button"
                onClick={() => {
                    document.getElementById('loginbox').style.display = 'block';
                    document.getElementById('account').style.display = 'none';
                    document.getElementById('newacc').style.display = 'block';
                    document.getElementById('log').style.display = 'none';
                }}
                >
                Login
                </button>

            </div>
            </div>
        </div>
        </div>

    );
};
export default Login;