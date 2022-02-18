import React, {useState} from 'react'
import { Link } from 'react-router-dom';

const Login = () => {

    //useState untuk update nilai
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    //destrcuture = formData
    const { email, password } = formData;

    // ketika onChange
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

        //ketika onSubmit
        const onSubmit = e => {
        e.preventDefault();
        console.log('SUCCESS');
    };

    return(
<section class="container">
    <div class="alert alert-danger">
      Invalid credentials
    </div>
    <h1 class="large text-primary">Sign In</h1>
    <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
    <form class="form" onSubmit={e => onSubmit(e)}>
      <div class="form-group">
        <input 
            type="email" 
            placeholder="Email Address" 
            name="email" 
            required 
            value={email}
            onChange={e => onChange(e)}
        />
      </div>
      <div class="form-group">
        <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password}
            onChange={e => onChange(e)}
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Login" />
    </form>
    <p class="my-1">
      Don't have an account? <Link to="/register"> SignUp</Link>
    </p>
</section>
    );
}

export default Login