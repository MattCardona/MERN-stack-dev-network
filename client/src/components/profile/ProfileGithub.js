import React from 'react';
import PropTypes from 'prop-types';

class ProfileGithub extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: 5,
      repos: []
    }
  }
  componentDidMount() {
    const { username } = this.props;
    const { count } = this.state;

    fetch(`/api/profile/github/${username}/${count}`)
      .then(res => res.json())
      .then(data => {
        // console.log(`This is the data ${JSON.stringify(data, undefined, 2)}`);
        if(this.refs.myRef){
          this.setState((prevState) => ({repos: data}));
        }
      })
      .catch(e => console.log(JSON.stringify(e, undefined, 2)));
  }
  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
      ));
    return (
      <div ref="myRef">
        <hr/>
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems.length > 0 ? repoItems : null}
      </div>
    )
  }
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGithub;