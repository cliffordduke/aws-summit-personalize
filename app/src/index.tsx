import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Grommet, Box, Heading } from 'grommet';
import { BrowserRouter as Router, Route, Link, Switch, withRouter, Redirect } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import { App, RecommendationList, MyHistory } from './components'
import { UserContext } from './contexts'
import { useLocalStorage } from './LocalStorage';
import Amplify from 'aws-amplify'
import Analytics from '@aws-amplify/analytics'
import settings from './settings'
import { detect } from 'detect-browser'


Amplify.configure(settings.amplify_config)

Analytics.autoTrack('pageView', {
  enable: true,
  eventName: 'pageView',
  attributes: () => detect(),
  type: 'SPA'
})

Analytics.autoTrack('event', {
  enable: true,
  events: ['click']
})

const theme = {
  global: {
    colors: {
      brand: '#FF9900',
      focus: '#FFCC83'
    },
    font: {
      family: 'AmazonEmber',
      size: '14px',
      height: '20px',
    },
  },
};

const AppHeader = withRouter(({ location }) => {

  return (
    <UserContext.Consumer>
      {
        ({ userId }) => (
          <Box
            tag="header"
            direction="row"
            align="center"
            justify="between"
            gap="medium"
            background={{ color: "brand", dark: true }}
            pad={{ left: 'medium', right: 'small', vertical: 'small' }}
            margin={{ bottom: 'medium' }}

            elevation='medium'
          >
            <Heading level={4} margin="xsmall"><Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>Amazon Personalize MovieLens Demo</Link></Heading>
            {userId > 0 &&
              <Box direction="row" gap="xxsmall" justify="end"
              >{`Your User ID: ${userId}`} |
            {location.pathname === '/recommendations/history' || location.pathname === '/'
                  ? <Link to={`/recommendations`} style={{ textDecoration: 'none', color: 'inherit' }}>Recommendations</Link>
                  : <Link to={`/recommendations/history`} style={{ textDecoration: 'none', color: 'inherit' }}>History</Link>}
              </Box>
            }

          </Box>
        )
      }
    </UserContext.Consumer>
  )
})


const Layout: React.FC = () => {
  const [userId, setUserId] = useLocalStorage<number>('UserID')

  function PrivateRoute({ component: Component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={props =>
          userId > 0 ? (
            <Component {...props} />
          ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: props.location }
                }}
              />
            )
        }
      />
    );
  }

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <Router>
        <div className="App">
          <Grommet theme={theme}>
            <AppHeader />
            <Box height="70vh">
              <Switch>
                <Route path='/' exact component={App} />
                <PrivateRoute path='/recommendations' exact component={RecommendationList} />
                <PrivateRoute path='/recommendations/history' exact component={MyHistory} />
                <Route path='/recommendations/history/:userId' exact component={MyHistory} />
                <Route path='/recommendations/:userId' exact component={RecommendationList} />
              </Switch>
            </Box>
          </Grommet>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

ReactDOM.render(<Layout />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
