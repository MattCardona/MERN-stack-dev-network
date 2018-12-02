import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm.js';
import Spinner from '../common/Spinner.js';

class Posts extends React.Component {
  render() {
    return (
      <div className="feed">
        <div className="conatiner">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Posts;