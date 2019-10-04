import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1
  };

  titleChanged(title) {
    this.setState({title});
  }

  urlChanged(url) {
    this.setState({url});
  }

  descriptionChanged(description) {
    this.setState({description});
  }

  ratingChanged(rating) {
    this.setState({rating});
  }

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { title, url, description, rating } = e.target
    const bookmark = (({ id, title, url, description, rating }) => ({id, title, url, description, rating}))(this.state);
    console.log(bookmark);
    this.setState({ error: null })

    const pathArray = this.props.location.pathname.split('/');
    const pathId = pathArray[pathArray.length - 1];
    const { bookmarkId } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
      })
      .then(() => {
        this.context.updateBookmark(bookmark)
        title.value = ''
        url.value = ''
        description.value = ''
        rating.value = ''
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  componentDidMount = () => {
    const pathArray = this.props.location.pathname.split('/');
    const pathId = pathArray[pathArray.length - 1];
    const { bookmarkId } = this.props.match.params
    console.log(pathId);
     fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(json => {
        this.setState({
          id: json.id,
          title: json.title,
          url: json.url,
          description: json.description,
          rating: json.rating
        })
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      }); 
  };

  render() {
    const { error } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={this.state.title}
              onChange={e => this.titleChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={this.state.url}
              onChange={e => this.urlChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={e => this.descriptionChanged(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={this.state.rating}
              onChange={e => this.ratingChanged(e.target.value)}
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
