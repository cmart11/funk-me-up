import React from 'react'

export default function LoginButton() {
  return (
    <div>
      <button
        type="submit"
        onClick={() => {
          window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://funkmeup-backend.herokuapp.com/login</div>'
        }}
      >
        Login with Spotify
      </button>
    </div>
  )
}
