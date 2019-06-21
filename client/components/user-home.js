import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import LoginButton from './LoginButton'
import {Login} from './auth-form'
import SongViewList from './SongListView'

import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

export class UserHome extends React.Component {
  constructor(props) {
    super(props)
    const token = this.getAccessToken()
    if (token) {
      spotifyApi.setAccessToken(token)
    }
    this.state = {
      isLoggedIn: !!token,
      name: '',
      userId: '',
      nowPlaying: {},
      playlistName: [],
      check: false,
      playlistTracks: []
    }
    this.generateSingleArtistPlaylist = this.generateSingleArtistPlaylist.bind(
      this
    )
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
        .then(data => {
          this.setState({name: data.display_name, userId: data.id})
        })

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
    this.setState({check: true})
    spotifyApi.getMyCurrentPlaybackState().then(res => {
      console.log('NOWPLAYING OBJ:  ', res)
      this.setState({
        nowPlaying: {
          artistId: res.item.artists[0].id,
          name: res.item.name,
          albumArt: res.item.album.images[0].url
        }
      })
    })
  }

  generateSingleArtistPlaylist(artistId) {
    spotifyApi
      .getArtistAlbums(artistId, {limit: 10})
      .then(data => data.items.map(album => album.id))
      .then(albumIds => spotifyApi.getAlbums(albumIds))
      .then(albumTracks =>
        albumTracks.albums.map(album => {
          return album.tracks.items
        })
      )
      .then(tracks => {
        let all = tracks.reduce((acc, track) => {
          return [...acc, ...track]
        }, [])
        let result = []
        for (let i = 0; i < 20; i++) {
          let randomNum = Math.floor(Math.random() * all.length)
          result.push(all[randomNum].id)
        }
        return result
      })
      .then(trackIds => spotifyApi.getTracks(trackIds))
      .then(data => {
        this.setState({playlistTracks: data.tracks})
        console.log('this.state.playlistTracks:    ', this.state.playlistTracks)
      })
  }

  render() {
    return (
      <div>
        <h1>Title</h1>
        {this.state.isLoggedIn ? (
          <div>
            <h3>Welcome, {this.state.name}</h3>
            {this.state.check ? (
              <div>
                <h3>Now Playing:</h3>
                <h4>{this.state.nowPlaying.name}</h4>
                <img
                  src={this.state.nowPlaying.albumArt}
                  style={{width: '200px', height: '200px'}}
                />
                <button
                  type="submit"
                  onClick={() =>
                    this.generateSingleArtistPlaylist(
                      this.state.nowPlaying.artistId
                    )
                  }
                >
                  Generate Playlist
                </button>
              </div>
            ) : null}
            <button onClick={() => this.getNowPlaying()} type="submit">
              Check current song!
            </button>
            <SearchBar
              getAccessToken={this.getAccessToken}
              generateSingleArtistPlaylist={this.generateSingleArtistPlaylist}
            />
            <h3>My Playlists</h3>
            {this.state.playlistName.map(name => <h3 key={name}>{name}</h3>)}
          </div>
        ) : (
          <div>
            <LoginButton />
            <h4>No Playlists</h4>
          </div>
        )}
        {this.state.playlistTracks.length ? (
          <SongViewList tracks={this.state.playlistTracks} />
        ) : null}
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
