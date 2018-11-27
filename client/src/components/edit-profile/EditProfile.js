import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup.js';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup.js';
import InputGroup from '../common/InputGroup.js';
import SelectListGroup from '../common/SelectListGroup.js';
import { createProfile, getCurrentProfile } from '../../actions/profileActions.js';
import isEmpty from '../../validation/is-empty.js';

class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
    if(nextProps.profile.profile){
      const profile = nextProps.profile.profile;
      const {company, website, location, githubusername, bio, social} = profile;
      // bring skills back to comma seperated values
      const skillsCSV = profile.skills.join(',');
      // if profile field does not exist make to empty string
      profile.company = !isEmpty(company) ? company : '';
      profile.website = !isEmpty(website) ? website : '';
      profile.location = !isEmpty(location) ? location : '';
      profile.githubusername = !isEmpty(githubusername) ? githubusername : '';
      profile.bio = !isEmpty(bio) ? bio : '';
      profile.social = !isEmpty(social) ? social : {};
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
      profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
      profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
      profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
      profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';
      // set the component field states
      this.setState(prevState => ({
        ...prevState,
        ...profile,
        skills: skillsCSV
      }));
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const {handle, company, website,location,status, skills, githubusername, bio, twitter, facebook, linkedin, youtube, instagram} = this.state;
    const profileData = {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram
    };
    this.props.createProfile(profileData, this.props.history);
  }
  onChange(e) {
    const key =  e.target.name;
    const val = e.target.value
    this.setState(() => ({[key]: val}));
  }
  render() {
    const { errors, displaySocialInputs } = this.state;
    let socialInputs;

    if(displaySocialInputs){
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook Page URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="YouTube Channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="Instagram Page URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      )
    }
    // options for status
    const options = [
      {label: '* Select Professional Status', value: 0},
      {label: 'Developer', value: 'Developer'},
      {label: 'Junior Developer', value: 'Junior Developer'},
      {label: 'Senior Developer', value: 'Senior Developer'},
      {label: 'Manager', value: 'Manager'},
      {label: 'Student or Learning', value: 'Student or Learning'},
      {label: 'Instructor or Teacher', value: 'Instructor or Teacher'},
      {label: 'Intern', value: 'Intern'},
      {label: 'Other', value: 'Other'}
    ];
    return (
       <div className="create-profile">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <a href="dashboard.html" className="btn btn-light">
                  Go Back
                </a>
                <h1 className="display-4 text-center">Edit Profile</h1>
                <small className="d-block pb-3">* = required field</small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Profile Handle"
                    name="handle"
                    value={this.state.handle}
                    onChange={this.onChange}
                    error={errors.handle}
                    info="A unique handle for your profile URL. Your full name, company name, nickname."
                  />
                  <SelectListGroup
                    placeholder="Status"
                    name="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    options={options}
                    error={errors.status}
                    info="Give us an idea where you are in your career"
                  />
                  <TextFieldGroup
                    placeholder="Company"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                    info="Could be your own company or one you work for"
                  />
                  <TextFieldGroup
                    placeholder="Website"
                    name="website"
                    value={this.state.website}
                    onChange={this.onChange}
                    error={errors.website}
                    info="Could be your own website or one you work for"
                  />
                  <TextFieldGroup
                    placeholder="Location"
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                    error={errors.location}
                    info="City or city and state (eg. SF, CA)"
                  />
                  <TextFieldGroup
                    placeholder="* Skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.onChange}
                    error={errors.skills}
                    info="Please use comma separated values (eg. HTML,CSS,JAVASCRIPT,C)"
                  />
                  <TextFieldGroup
                    placeholder="Github Username"
                    name="githubusername"
                    value={this.state.githubusername}
                    onChange={this.onChange}
                    error={errors.githubusername}
                    info="If you want your latest repos and a Github link, include your username"
                  />
                  <TextAreaFieldGroup
                    placeholder="Short Bio"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                    error={errors.bio}
                    info="Tell us a little about yourself"
                  />
                  <div className="mb-3">
                    <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }))
                    }} className="btn btn-light">
                      Add Social Network Links
                    </button>
                    <span className="text-muted">Optional </span>
                  </div>
                  {socialInputs}
                  <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, {createProfile, getCurrentProfile})(withRouter(EditProfile));