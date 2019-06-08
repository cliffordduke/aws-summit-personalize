import React, { useState } from 'react'
import { Box, Image, Button, TextInput } from 'grommet';
import { UserContext } from '../contexts'
import { withRouter } from 'react-router-dom'

export const App = withRouter(({ history }) => {
  const [userInput, setUserInput] = useState("");
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return (
    <UserContext.Consumer>
      {
        ({ setUserId }) => (
          <Box
            style={{ height: "100vh", width: "40vw" }}
            pad="large"
            alignSelf="center"
            justify="center"
            align="center">
            <Box pad="large">
              <Image src="./AWS_Logo.png" />
            </Box>
            <Box pad="small">
              <TextInput placeholder="Use Existing User ID" value={userInput} onChange={event => setUserInput(event.target.value)} />
            </Box>
            <Box pad="small">
              <Button label={userInput ? 'Use Existing User' : 'New User'} onClick={() => {
                setUserId(userInput ? parseInt(userInput) : getRandomInt(500000, 599999))
                history.push('/recommendations')
              }} />
            </Box>
          </Box>
        )
      }
    </UserContext.Consumer>

  );
})