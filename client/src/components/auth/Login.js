import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from '../../actions/authActions.js';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }
  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
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
    const {email, password} = this.state;
    const userData = {
      email,
      password
    };
    this.props.loginUser(userData);
  }
  render() {
    const {errors} = this.state;

    return (
        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">Sign in to your DevConnector account</p>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input type="email" className={classnames('form-control form-control-lg',{'is-invalid': errors.email})} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                    {errors.email && <div className="is-invalid">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <input type="password" className={classnames('form-control form-control-lg',{'is-invalid': errors.password})} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                    {errors.password && <div className="is-invalid">{errors.password}</div>}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);