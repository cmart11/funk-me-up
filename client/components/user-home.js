import React from 'react'
import SearchBar from './SearchBar'
import LoginButton from './LoginButton'
import SongViewList from './SongListView'

import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

export default class UserHome extends React.Component {
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
      // newPlaylist: {}
    }
    this.generateSingleArtistPlaylist = this.generateSingleArtistPlaylist.bind(
      this
    )
    this.createNewPlaylist = this.createNewPlaylist.bind(this)
    this.addTracksToPlaylist = this.addTracksToPlaylist.bind(this)
    this.getNowPlaying = this.getNowPlaying.bind(this)
  }

  getAccessToken() {
    let parsed = queryString.parse(window.location.search)
    return parsed.access_token
  }

  componentDidMount() {
    const accessToken = this.getAccessToken()

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

      this.getUserPlaylist()
    }
  }

  getUserPlaylist() {
    const accessToken = this.getAccessToken()
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

  getNowPlaying() {
    this.setState({check: true})
    spotifyApi.getMyCurrentPlaybackState().then(res => {
      res &&
        this.setState({
          nowPlaying: {
            artistId: res.item.artists[0].id,
            name: res.item.name,
            albumArt: res.item.album.images[0].url,
            artistName: res.item.artists[0].name
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
      })
    // console.log('playlistTracks:    ', this.state.playlistTracks)
    // spits out individual track info
  }

  createNewPlaylist(userId, playlistName = 'my new p-list') {
    spotifyApi
      .createPlaylist(userId, {name: playlistName})
      // .then(data => this.setState({ newPlaylist: data }))
      .then(data => this.addTracksToPlaylist(data))
    this.getUserPlaylist()
  }

  addTracksToPlaylist(newPlaylist) {
    const {playlistTracks} = this.state
    const id = newPlaylist.id
    const trackUris = playlistTracks.map(track => track.uri)
    return spotifyApi.addTracksToPlaylist(id, trackUris)
  }

  // Returns track list of related artists
  createRelatedArtistsPlaylist(artistId) {
    spotifyApi
      .getArtistRelatedArtists(artistId)
      .then(res => res.artists.map(artist => artist.id).slice(0, 5))
      .then(artistIds => {
        return Promise.all([
          spotifyApi.getArtistTopTracks(artistIds[0], 'US'),
          spotifyApi.getArtistTopTracks(artistIds[1], 'US'),
          spotifyApi.getArtistTopTracks(artistIds[2], 'US'),
          spotifyApi.getArtistTopTracks(artistIds[3], 'US'),
          spotifyApi.getArtistTopTracks(artistIds[4], 'US')
        ])
      })
      .then(artistsTopTracks => {
        return artistsTopTracks.reduce((acc, artistTracks) => {
          for (let i = 0; i < 4; i++) {
            let randomNum = Math.floor(
              Math.random() * artistTracks.tracks.length
            )
            acc.push(artistTracks.tracks[randomNum])
          }
          return acc
        }, [])
      })
      .then(data => {
        this.setState({playlistTracks: data})
      })
  }

  render() {
    return (
      <div>
        <div id="title-container">
          <h1 id="funkmeup-title">Funk Me Up</h1>
        </div>
        {this.state.isLoggedIn ? (
          <div>
            <div id="home-top">
              <h3>Hey, {this.state.name.split(' ')[0]}!</h3>
              {this.state.check ? (
                <div>
                  <h3 id="np-header">Now Playing: </h3>
                  <div
                    className="np-container"
                    style={{display: 'flex', width: '700px'}}
                  >
                    <img
                      src={this.state.nowPlaying.albumArt}
                      style={{
                        width: '250px',
                        height: '250px',
                        marginRight: '1rem'
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          marginLeft: '15px',
                          marginBottom: '0px',
                          fontSize: '2rem'
                        }}
                      >
                        {this.state.nowPlaying.name}
                      </h4>
                      <p style={{marginLeft: '15px'}}>
                        by {this.state.nowPlaying.artistName}
                      </p>
                      <div
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                      >
                        <button
                          type="submit"
                          onClick={() =>
                            this.generateSingleArtistPlaylist(
                              this.state.nowPlaying.artistId
                            )
                          }
                          className="np-bttn"
                        >
                          Create {this.state.nowPlaying.artistName} Playlist
                        </button>
                        <button
                          type="submit"
                          onClick={() =>
                            this.createRelatedArtistsPlaylist(
                              this.state.nowPlaying.artistId
                            )
                          }
                          className="np-bttn"
                        >
                          Create Playlist from Related Artists
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <button
                onClick={() => this.getNowPlaying()}
                type="submit"
                className="np-bttn"
              >
                Find Now Playing
              </button>
            </div>
            <hr />
            <SearchBar
              getAccessToken={this.getAccessToken}
              generateSingleArtistPlaylist={this.generateSingleArtistPlaylist}
            />
            {/* <h3>My Playlists</h3>
            {this.state.playlistName.map(name => <h3 key={name}>{name}</h3>)} */}
          </div>
        ) : (
          <LoginButton />
        )}
        {this.state.playlistTracks.length ? (
          <SongViewList
            tracks={this.state.playlistTracks}
            createPlaylist={this.createNewPlaylist}
            userId={this.state.userId}
          />
        ) : null}
      </div>
    )
  }
}
