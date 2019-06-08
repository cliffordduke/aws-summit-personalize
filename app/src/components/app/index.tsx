import React from 'react'
import { Box, Image, Grid, Button } from 'grommet';
import { Link } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Box
      style={{ height: "100vh" }}
      pad="large"
      justify="center"
      align="center">
      <Box pad="large">
        <Image src="./AWS_Logo.png" />
      </Box>

      <Link to="/new">
        <Button label="Start" />
      </Link>
    </Box>
  );
}

export default App;

/*
      <Grid
        areas={[
          { name: "logo", start: [0, 0], end: [1, 0] }
        ]}></Grid>
*/