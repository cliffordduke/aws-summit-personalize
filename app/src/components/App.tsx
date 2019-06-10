import React, { useState, useContext } from 'react'
import { Box, Image, Button, TextInput, Grid } from 'grommet';
import { UserContext } from '../contexts'
import { withRouter } from 'react-router-dom'
import logo from '../assets/AWS_logo.png'

export const App = withRouter(({ history }) => {
  const [userInput, setUserInput] = useState("");
  const { setUserId, userId } = useContext(UserContext);
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      setUserInput(event.target.value)
    }
  }

  function onEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === 13) submit();
  }

  function submit() {
    setUserId(userInput ? parseInt(userInput) : getRandomInt(500000, 599999))
    history.push('/recommendations')
  }

  function logout() {
    setUserId(0)
  }

  return (
    <Box
      style={{ height: "100vh", width: "40vw" }}
      pad="large"
      alignSelf="center"
      justify="center"
      align="center">
      <Box pad="large">
        <Image src={logo} />
      </Box>
      <Box pad="small">
        <TextInput placeholder="Use Existing User ID" value={userInput} onChange={onChange} onKeyUp={onEnter} />
      </Box>
      <Box pad="small">
        <Button label={userInput ? 'Use Existing User' : 'New User'} onClick={submit} />
        {userId !== 0 &&
          <Button margin={{ top: 'small' }} label="Logout" onClick={logout} />
        }
      </Box>
    </Box>
  );
})