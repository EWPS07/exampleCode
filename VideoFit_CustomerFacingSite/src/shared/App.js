import React from 'react';
import PropTypes from 'prop-types';
import Header from '../client/components/Header'
import Home from '../client/components/Home'
import TrainerSignup from '../client/hoc/TrainerSignup'

import {
  Route,
  Switch,
  Link
} from 'react-router-dom'

export const PageNotFound = (props, context = {}) => {
  if (context.setStatus) {
    context.setStatus(404)
  }
  
  return (
    <div>
      <h1>
        Page not found
      </h1>
      <Link to="/">
        Go home
      </Link>
    </div>
  )
}
PageNotFound.contextTypes = {
  setStatus: PropTypes.func.isRequired
}

const TestRouterPage = ({ match }) => (
  <div className="App-intro">
    <p>
      Test page {match.params.id}
    </p>
    <p>
    <Link to={`/`}>
      Home
    </Link>
    </p>
    <p>
      <Link to={`/aljlskaklksdkfaj falsflasd`}>
        Go to non-existent page
      </Link>
    </p>
  </div>
)

const App = () => (
  <div className="App">
    <Route path="/" component={ ({ match }) => (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/trainer/signup" component={ TrainerSignup } />
          <Route exact path="/test/:id" component={TestRouterPage}/>
          <Route component={PageNotFound}/>
        </Switch>
      </div>
    )}/>
  </div>
)

export default App
