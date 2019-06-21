import React from 'react'

export default class SongListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playlistName: ''
    }
  }
  render() {
    const {tracks, createPlaylist, userId} = props
    const trackIds = tracks.map(track => track.id)
    return (
      <div>
        <table style={{border: '1px white solid'}}>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Track</th>
              <th>Album</th>
              <th>Release Year</th>
              <th>
                <button type="submit" onClick={() => createPlaylist(userId)}>
                  Add to my Spotify playlists
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => (
              <tr key={track.id + index}>
                <td>{track.artists[0].name}</td>
                <td>{track.name}</td>
                <td>{track.album.name}</td>
                <td>{track.album.release_date.slice(0, 4)}</td>
                <td>
                  <button type="submit">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
