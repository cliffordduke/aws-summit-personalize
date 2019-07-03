import styled from "styled-components";
import React from "react";

export interface IEvent extends ILabel {
  label: string;
}

interface ILabel {
  backgroundColor?: string;
}

export const Container = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
`;

export const TimelineBlock = styled.ul`
  position: relative;
  max-width: 95%;
  list-style: none;
  &:before {
    background-color: black;
    content: "";
    margin-left: -1px;
    position: absolute;
    top: 0;
    left: 2em;
    width: 2px;
    height: 100%;
  }
`;

export const EventBlock = styled.li`
  position: relative;
`;

export const IconBlock = styled.label`
  transform: rotate(45deg);
  background-color: black;
  outline: 10px solid white;
  display: block;
  margin: 0.5em 0.5em 0.5em -0.5em;
  position: absolute;
  top: 0;
  left: 2em;
  width: 1em;
  height: 1em;
`;

export const Label = styled.p<ILabel>`
  color: black;
  background-color: ${props => props.backgroundColor || "black"};
  box-shadow: inset 0 0 0 0em #ef795a;
  display: inline-block;
  margin-bottom: 1.2em;
  padding: 0.25em 1em 0.2em 1em;
`;

export const BodyBlock = styled.div`
  padding: 2em 2em 0 2em;
  position: relative;
  top: -1.875em;
  left: 2em;
  width: 95%;
  h3 {
    font-size: 1.75em;
  }
  h4 {
    font-size: 1.2em;
    margin-bottom: 1.2em;
  }
`;

export const Details = styled.div`
  strong {
    font-weight: 700;
  }
  p {
    padding-bottom: 1.2em;
  }
`;

export const Timeline: React.FC = ({ children }) => (
  <Container>
    <TimelineBlock>{children}</TimelineBlock>
  </Container>
);

export const Event: React.FC<IEvent> = ({
  children,
  label,
  backgroundColor
}) => (
  <EventBlock>
    <IconBlock />
    <BodyBlock>
      <Label backgroundColor={backgroundColor}>{label}</Label>
      <Details>{children}</Details>
    </BodyBlock>
  </EventBlock>
);
