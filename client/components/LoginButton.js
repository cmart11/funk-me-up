import React from 'react'

export default function LoginButton() {
  return (
    <div>
      <button
        type="submit"
        onClick={() => (window.location = 'http://localhost:8888/login')}
      >
        Login with Spotify
      </button>
    </div>
  )
}
