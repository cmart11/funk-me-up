import React from 'react'

export default function LoginButton() {
  return (
    <div className="login-div">
      <h4>
        Sign in with your Spotify account to start creating playlists based on
        the music you're listening to now!
      </h4>
      <button
        className="np-bttn login-div logbttn"
        type="submit"
        onClick={() => {
          window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://funkmeup-backend.herokuapp.com/login'
        }}
      >
        Login with Spotify
      </button>
    </div>
  )
}
