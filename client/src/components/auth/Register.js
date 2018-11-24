import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions.js';

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
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){
      this.setState(() => ({errors: nextProps.errors}));
    }
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
    this.props.registerUser(newUser, this.props.history);
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));