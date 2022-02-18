import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';



const Regsiter = () => {

// useState untuk update value melalui form
const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
});

//desctructure semua value dari formData
const {name, email, password, password2} = formData;

//helper method
// cek kesesuai password dengan password 2
// isi dari {...formData} => {name: '', email: '', password: '', password2: ''}
const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    //onSubmit
    const onSubmit = e => {
        e.preventDefault();
    if (password !== password2) {
        console.log('Password do not match');
    } else {
        console.log(formData);
    }
};

    return(
        <Fragment>
<section class="container">
    <h1 class="large text-primary">Sign Up</h1>
    <p class="lead"><i class="fas fa-user"></i> Create Your Account</p>
    <form class="form" onSubmit={e => onSubmit(e)}>
      <div class="form-group">
        <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            required 
            value={name}
            onChange={e => onChange(e)}
        />
      </div>
      <div class="form-group">
        <input 
            type="email" 
            placeholder="Email Address" 
            name="email" 
            value={email}
            onChange={e => onChange(e)}
        />
        <small class="form-text">This site uses Gravatar so if you want a profile image, use a
          Gravatar email</small>
      </div>
      <div class="form-group">
        <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            minLength="6" 
            value={password}
            onChange={e => onChange(e)}
        />
      </div>
      <div class="form-group">
        <input 
            type="password" 
            placeholder="Confirm Password" 
            name="password2" 
            minLength="6" 
            value={password2}
            onChange={e => onChange(e)}
        />
      </div>
      <input type="submit" class="btn btn-primary" value="Register" />
    </form>
    <p class="my-1">
      Already have an account? <Link to="/login">SignIn</Link>
    </p>
</section>
        </Fragment>
    );
}

export default Regsiter