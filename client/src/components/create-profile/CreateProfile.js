import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup.js';

class CreateProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {},
    }
  }
  render() {
    return (
       <div class="create-profile">
          <div class="container">
            <div class="row">
              <div class="col-md-8 m-auto">
                <a href="dashboard.html" class="btn btn-light">
                  Go Back
                </a>
                <h1 class="display-4 text-center">Create Your Profile</h1>
                <p class="lead text-center">Let's get some information to make your profile stand out</p>
                <small class="d-block pb-3">* = required field</small>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps)(CreateProfile);