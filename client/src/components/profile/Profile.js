import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader.js';
import ProfileAbout from './ProfileAbout.js';
import ProfileCreds from './ProfileCreds.js';
import ProfileGithub from './ProfileGithub.js';
import Spinner from '../common/Spinner.js';
import { getProfileByHandle } from '../../actions/profileActions.js';

class Profile extends React.Component {
  componentDidMount() {
    const {handle} = this.props.match.params;
    if(handle){
      this.props.getProfileByHandle(handle);
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if(profile === null || loading){
      profileContent = <Spinner />;
    }else{
      profileContent = (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back to Profiles
              </Link>
            </div>
            <div className="col-md-6">
            </div>
          </div>
          <ProfileHeader profile={profile}/>
          <ProfileAbout />
          <ProfileCreds />
          <ProfileGithub />
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfileByHandle })(Profile);