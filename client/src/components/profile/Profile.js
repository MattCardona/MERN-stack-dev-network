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
    return (
      <div>
        <ProfileHeader />
        <ProfileAbout />
        <ProfileCreds />
        <ProfileGithub />
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