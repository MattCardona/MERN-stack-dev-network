import React from 'react';
import axios from 'axios';
import classnames from 'classnames';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };
  }
  onChange(e) {
    // e.preventDefault();
    const key =  e.target.name;
    const val = e.target.value
    this.setState(() => ({[key]: val}));
  }
  onSubmit(e) {
    e.preventDefault();
    const {name, email, password, password2} = this.state;
    const newUser = {
      name,
      email,
      password,
      password2
    };
    axios.post('/api/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(e => this.setState(() => ({errors: e.response.data})));
  }
  render() {
    const {errors} = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.onChange} className={classnames('form-control form-control-lg',{'is-invalid': errors.name})} />
                  {errors.name && <div className="is-invalid">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <input type="email" className={classnames('form-control form-control-lg',{'is-invalid': errors.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && <div className="is-invalid">{errors.email}</div>}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg',{'is-invalid': errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                  {errors.password && <div className="is-invalid">{errors.password}</div>}
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg',{'is-invalid': errors.password2})} placeholder="Confirm Password" name="password2" value={this.state.password2} onChange={this.onChange} />
                  {errors.password2 && <div className="is-invalid">{errors.password2}</div>}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>

    )
  }
};

export default Register;