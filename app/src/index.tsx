import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Grommet, Box } from 'grommet';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import App from './components/app';



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

const AppHeader: React.FC = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background={{ color: "brand", dark: true }}
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    {...props}
  />
)


const Layout: React.FC = () => {
  return (
    <div className="App">
      <Grommet theme={theme}>
        <AppHeader><b>Amazon Personalize</b></AppHeader>
        <Router>
          <Route path='/' exact component={App} />
        </Router>
      </Grommet>
    </div>
  );
}

ReactDOM.render(<Layout />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
