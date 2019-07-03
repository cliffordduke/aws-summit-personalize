import React from "react";
import { Box, Text } from "grommet";

export const Footer: React.FC = () => (
  <Box
    direction="row"
    justify="between"
    pad={{ left: "medium", top: "small", bottom: "small" }}
    background={{ color: "#161E2D", dark: true }}
    alignContent="center"
  >
    <Text weight="bold" size="small" color="white" alignSelf="center">
      Copyright &copy; 2019 Amazon Web Services |{" "}
      <a
        href="mailto:aws-hk@amazon.com"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Contact Us
      </a>
    </Text>
  </Box>
);
