import React from 'react'

export default class SongListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlistName: '',
      toggle: false
    }
    this.toggle = this.toggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  toggle() {
    this.setState({toggle: !this.state.toggle})
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // createPlaylist(userId, this.state)
  handleSubmit(event) {
    event.preventDefault()
    const {userId, createPlaylist} = this.props
    createPlaylist(userId, this.state.playlistName)
  }

  render() {
    const {tracks} = this.props
    // const trackIds = tracks.map(track => track.id)
    // console.log('tracks', tracks)

    return (
      <div>
        <hr />
        <div className="add-pl-container">
          <button onClick={this.toggle} type="submit" className="toggle-add">
            Create Playlist?
          </button>
          {this.state.toggle && (
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="playlistName"
                placeholder="playlist name..."
                value={this.state.playlistName}
                onChange={this.handleChange}
              />
              <button type="submit" className="toggle-add">
                Add to Spotify
              </button>
            </form>
          )}
        </div>
        <div id="playlist-container">
          <table id="playlist-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Track</th>
                <th>Album</th>
                <th className="release-year">Year</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr key={track.id + index}>
                  <td>{track.artists[0].name}</td>
                  <td>{track.name}</td>
                  <td>{track.album.name}</td>
                  <td className="release-year">
                    {track.album.release_date.slice(0, 4)}
                  </td>
                  <td>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="listen-link"
                    >
                      Listen on Spotify
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
