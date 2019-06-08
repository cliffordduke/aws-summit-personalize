import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Grommet, Box, Menu, Heading } from 'grommet';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import { App, User } from './components'
import { UserContext } from './contexts'
import { useLocalStorage } from './LocalStorage';


const theme = {
  global: {
    colors: {
      brand: '#FF9900'
    },
    font: {
      family: 'AmazonEmber',
      size: '14px',
      height: '20px',
    },
  },
};

const AppHeader: React.FC = () => {

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
            <Heading level={4} margin="xsmall"><Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>Amazon Personalize</Link></Heading>
            <Box direction="row" gap="xxsmall" justify="end"
            >{userId ? `Your User ID: ${userId}` : ''}</Box>
          </Box>
        )
      }
    </UserContext.Consumer>
  )
}


const Layout: React.FC = () => {
  const [userId, setUserId] = useLocalStorage('UserID', 0)
  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <Router>
        <div className="App">
          <Grommet theme={theme}>
            <AppHeader />

            <Route path='/' exact component={App} />
            <Route path='/recommendations' exact component={User} />
            <Route path='/recommendations/:userId' component={User} />

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
