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
      artistName: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    spotifyApi
      .searchArtists(this.state.artistName)
      .then(res => console.log(res))
  }

  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            name="artistName"
            placeholder="Search artist..."
            value={this.state.artistName}
            onChange={this.handleChange}
          />
          <button type="submit" onClick={this.handleSubmit}>
            {' '}
            Search
          </button>
        </form>
      </div>
    )
  }
}
