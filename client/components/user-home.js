import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SearchBar from './SearchBar'
import LoginButton from './LoginButton'
import {Login} from './auth-form'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h1>Title</h1>

      <LoginButton />
      <h3>Welcome, {email}</h3>
      <SearchBar />
    </div>
  )
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
