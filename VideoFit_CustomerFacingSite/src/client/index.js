import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store, { history } from './redux/store'
import App from '../shared/App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

render(
  <Provider store={ store }>
    <Router history={ history }>
      <div>
        <App />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
