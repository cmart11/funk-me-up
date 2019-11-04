import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {UserHome} from './components'

/**
 * COMPONENT
 */
export default class Routes extends Component {
  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/" component={UserHome} />
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}
            <Route path="/home" component={UserHome} />
          </Switch>
        )}
      </Switch>
    )
  }
}
