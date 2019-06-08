import React from 'react'
import { Box, Image, Grid, Button } from 'grommet';
import { Link, Redirect } from 'react-router-dom'
import { UserContext, IUserContext } from '../contexts'
import { withRouter } from 'react-router-dom'
import { useLocalStorage } from '../LocalStorage';

export const App = withRouter(({ history }) => {
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const [userId, setUserId] = useLocalStorage('UserID', 0)
  return (
    <UserContext.Consumer>
      {
        ({ setUserId }) => (
          <Box
            style={{ height: "100vh" }}
            pad=" l arge"
            justify="center"
            align="center">
            <Box pad="large">
              <Image src="./AWS_Logo.png" />
            </Box>

            <Button label="New User" onClick={() => {
              setUserId(getRandomInt(500000, 599999))
              history.push('/recommendations')
            }} />
          </Box>
        )
      }
    </UserContext.Consumer>

  );
})