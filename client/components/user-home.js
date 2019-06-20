import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import LoginButton from './LoginButton'
import {Login} from './auth-form'
import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

export class UserHome extends React.Component {
  constructor(props) {
    super(props)
    const token = this.getAccessToken()
    console.log('TOKEN', token)
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      isLoggedIn: !!token,
      name: '',
      nowPlaying: {},
      playlistName: []
    }
  }

  getAccessToken() {
    let parsed = queryString.parse(window.location.search)
    return parsed.access_token
  }

  componentDidMount() {
    let accessToken = this.getAccessToken()

    if (accessToken) {
      this.getAccessToken()
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => res.json())
        .then(data => this.setState({name: data.display_name}))

      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
        .then(res => res.json())
        .then(data =>
          this.setState({playlistName: data.items.map(item => item.name)})
        )
    }
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(res => {
      this.setState({
        nowPlaying: {
          name: res.item.name,
          albumArt: res.item.album.images[0].url
        }
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  render() {
    return (
      <div>
        <h1>Title</h1>
        {this.state.isLoggedIn ? (
          <div>
            <h3>Welcome, {this.state.name}</h3>
            <div>
              <h3>Now Playing:</h3>
              <h4>{this.state.nowPlaying.name}</h4>
              <img
                src={this.state.nowPlaying.albumArt}
                style={{width: '200px', height: '200px'}}
              />
            </div>
            <button onClick={() => this.getNowPlaying()} type="submit">
              Check current song!
            </button>
            <h3>My Playlists</h3>
            {this.state.playlistName.map(name => <h3 key={name}>{name}</h3>)}
          </div>
        ) : (
          <div>
            <LoginButton />
            <h4>No Playlists</h4>
          </div>
        )}
        <SearchBar />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
