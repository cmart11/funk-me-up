import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    if (this.props.getAccessToken()) {
      spotifyApi.setAccessToken(this.props.getAccessToken())
    }
    this.state = {
      artistName: '',
      artistResults: [],
      playlistTracks: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  artistSearchQuery() {
    spotifyApi.searchArtists(this.state.artistName).then(res => {
      let list = res.artists.items.reduce((acc, artist) => {
        const reducedArtist = {
          id: artist.id,
          name: artist.name,
          imgUrl: artist.images[0],
          externalUrl: artist.external_urls.spotify
        }
        acc.push(reducedArtist)
        return acc
      }, [])
      list = list.slice(0, 5)
      this.setState({
        artistResults: list
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.artistSearchQuery()
  }

  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            name="artistName"
            placeholder="Search artists..."
            value={this.state.artistName}
            onChange={this.handleChange}
          />
          {this.state.artistName ? (
            <button type="submit" onClick={this.handleSubmit}>
              Search
            </button>
          ) : null}
        </form>
        {this.state.artistResults.map(artist => (
          <div key={artist.id}>
            {artist.imgUrl ? (
              <img
                src={artist.imgUrl.url}
                style={{width: '100px', height: '100px'}}
              />
            ) : (
              <img
                src="https://static.makeuseof.com/wp-content/uploads/2016/06/discover-new-music-spotify-670x335.jpg"
                style={{width: '100px', height: '100px', overflow: 'hidden'}}
              />
            )}
            <h3>{artist.name}</h3>
            <button
              type="submit"
              onClick={() => this.props.generateSingleArtistPlaylist(artist.id)}
            >
              Generate Playlist
            </button>
          </div>
        ))}
      </div>
    )
  }
}
