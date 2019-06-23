import React from 'react'

export default function LoginButton() {
  return (
    <div>
      <button
        type="submit"
        onClick={() => {
          window.location = window.location.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://funkmeup.herokuapp.com/login</div>'
        }}
      >
        Login with Spotify
      </button>
    </div>
  )
}
