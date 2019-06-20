import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import LoginButton from './LoginButton'
import {Login} from './auth-form'
import queryString from 'query-string'

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      playlistName: []
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
      .then(res => res.json())
      .then(data => this.setState({name: data.display_name}))

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

  render() {
    return (
      <div>
        <h1>Title</h1>

        <LoginButton />
        <h3>Welcome, {this.state.name}</h3>

        {this.state.playlistName.map(name => <h3 key={name}>{name}</h3>)}

        <SearchBar />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
