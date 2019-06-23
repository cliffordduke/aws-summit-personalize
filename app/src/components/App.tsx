import React, { useState, useContext } from 'react'
import { Box, Image, Button, TextInput, Grid } from 'grommet';
import { UserContext } from '../contexts'
import { withRouter } from 'react-router-dom'
import logo from '../assets/AWS_logo.png'

export const App = withRouter(({ history }) => {
  const [userInput, setUserInput] = useState("");
  const { setUserId, userId } = useContext(UserContext);

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
    setUserId(userInput ? parseInt(userInput) : (new Date()).getTime())
    history.push('/recommendations')
  }

  function logout() {
    setUserId(0)
  }

  return (
    <Box
      style={{ marginTop: '30vh' }}
      alignSelf="center"
      justify="center"
      align="center">
      <Grid
        rows={['small', 'small']}
        columns={['small']}
        gap="small"
        areas={[
          { name: 'logo', start: [0, 0], end: [0, 0] },
          { name: 'form', start: [0, 1], end: [0, 1] },
        ]}>
        <Box gridArea='logo'>
          <Image draggable={false} src={logo} />
        </Box>
        <Box gridArea='form'>
          <TextInput placeholder="Use Existing User ID" value={userInput} onChange={onChange} onKeyUp={onEnter} />
          <Box pad="small">
            <Button label={userInput ? 'Use Existing User' : 'New User'} onClick={submit} />
            {userId !== 0 &&
              <Button margin={{ top: 'small' }} label="Logout" onClick={logout} />
            }
          </Box>
        </Box>
      </Grid>
    </Box>
  );
})


let test = (userInput, userId, logout, submit) => (
  <Box
    style={{ height: "100vh" }}
    pad="large"
    alignSelf="center"
    justify="center"
    align="center">



  </Box>
)