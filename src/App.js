import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import EncounterGenerator from "./components/EncounterGenerator";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 300px;
`;

const Header = styled.header`
  background-image: url('https://karenswhimsy.com/public-domain-images/ancient-assyrians/images/ancient-assyrians-2.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 20vh;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
  position: relative;
  padding: 0 1rem;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(44, 62, 80, 0.6);
    z-index: 0;
  }

  @media (min-width: 1200px) {
    height: 25vh;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const rainbowShimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const ShimmerText = styled.h1`
  font-family: "Major Mono Display", monospace;
  font-weight: 900;
  font-size: 3rem;
  background: linear-gradient(
    270deg,
    white,
    red,
    violet,
    white,
    blue,
    green,
    yellow,
    red
  );
  background-size: 1400% 1400%;

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
  color: transparent;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  animation: ${rainbowShimmer} 6s ease infinite;

  @media (min-width: 1200px) {
    font-size: 4rem;
  }
  @media (max-width: 500px) {
    font-size: 2rem;
  }
`;

const InfoBox = styled.div`
  background: #34495e;
  padding: 1rem 2rem 1rem 1rem;
  border-radius: 5px;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.4;
  position: fixed;
  top: 20px;
  right: 1rem;
  left: 1rem;
  max-width: 20hv;
  z-index: 1500;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const ShowButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #34495e;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  z-index: 1600;

  &:hover {
    background: #16a085;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #1abc9c;
  }
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 1rem;
`;

const Footer = styled.footer`
  background: #c2bcbcff;
  color: black;
  text-align: center;
  padding: 1rem;

  a {
    color: #000000ff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ArenaApp = () => {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <ShimmerText as="h1">D&D 5e Encounter Generator</ShimmerText>
          {infoVisible && (
            <InfoBox>
              <CloseButton onClick={() => setInfoVisible(false)} aria-label="Hide info">
                &times;
              </CloseButton>

              <h2>About This Encounter Generator</h2>
              Hi, this is a personal project I made for DMing DnD, I wanted to make encounters easier but also for 
              them to have narrative value that I could use as inspiration, let me know if you have any problems, 
              my email is in the footer.<br />
              Just a heads up the encounters are generated using dnd 5e rules, so if you are using a different system, 
              the numbers might not make sense, also the more monsters in a fight the less XP there will be for the fight, 
              due to the way the XP budget works in DnD 5e.<br />
              Also, if the complication is a monster it will be added to the encounter, but it will not be counted in the XP budget,
              so the encounter will be dangrous, you will need to see if it will result in a TPK or not, I recommend using it as a fight is
              happening and the players come uppon it, if it makes sense in the narrative, or if you want to make a fight more difficult.
              <br />
              The linked monsters is just a search on 5e.tools, if you cannot find the monster there I suggest googling, I am sorry for the inconvenience.
            </InfoBox>
          )}
          {!infoVisible && (
            <ShowButton onClick={() => setInfoVisible(true)} aria-label="Show info">
              Info
            </ShowButton>
          )}
        </Header>

        <Main>
          <EncounterGenerator />
        </Main>

        <Footer>
          © 2025 Daniel Klausen | Free D&D 5e Encounter Generator |{' '}
          <a href="mailto:danielklausen90@gmail.com">danielklausen90@gmail.com</a>
        </Footer>
      </AppContainer>
    </>
  );
};

export default ArenaApp;
