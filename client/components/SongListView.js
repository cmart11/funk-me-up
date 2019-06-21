import React from 'react'

export default function SongListView(props) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Track</th>
            <th>Album</th>
            <th>Release Year</th>
          </tr>
        </thead>
        <tbody>
          {props.tracks.map((track, index) => (
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
