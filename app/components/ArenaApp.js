"use client";

import React, { useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import EncounterGenerator from "./EncounterGenerator";

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
  background-image: url('/header-bg.jpg');
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ShimmerText = styled.h1`
  font-family: "Major Mono Display", monospace;
  font-weight: 900;
  font-size: 3rem;
  background: linear-gradient(270deg, white, red, violet, white, blue, green, yellow, red);
  background-size: 1400% 1400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  animation: ${rainbowShimmer} 6s ease infinite;

  @media (min-width: 1200px) { font-size: 4rem; }
  @media (max-width: 500px) { font-size: 2rem; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const InfoBox = styled.div`
  background: #1e2a38;
  border: 1px solid #2e4057;
  border-radius: 10px;
  padding: 2rem 2.2rem 1.8rem;
  max-width: 600px;
  width: 100%;
  color: #dce6f0;
  font-family: "Goudy Bookletter 1911", serif;
  font-size: 1rem;
  line-height: 1.65;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const InfoTitle = styled.h2`
  font-family: "Teko", sans-serif;
  font-size: 1.7rem;
  color: #7eb8d4;
  margin: 0 0 1.2rem;
  letter-spacing: 0.03em;
`;

const InfoSection = styled.div`
  margin-bottom: 1.1rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const InfoSectionTitle = styled.h3`
  font-family: "Teko", sans-serif;
  font-size: 1.1rem;
  color: #a8d8ea;
  margin: 0 0 0.25rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const InfoDivider = styled.hr`
  border: none;
  border-top: 1px solid #2e4057;
  margin: 1rem 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  background: transparent;
  border: none;
  color: #7eb8d4;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #ffffff;
  }
`;

const ShowButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(30, 42, 56, 0.85);
  border: 1px solid #2e4057;
  color: #a8d8ea;
  padding: 0.45rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-family: "Teko", sans-serif;
  font-size: 1rem;
  letter-spacing: 0.05em;
  z-index: 1600;

  &:hover {
    background: #16a085;
    color: white;
    border-color: #16a085;
  }
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 1rem;
`;

const Footer = styled.footer`
  background: #c2bcbc;
  color: black;
  text-align: center;
  padding: 1rem;

  a {
    color: #000000;
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
          <ShimmerText>D&D 5e Encounter Generator</ShimmerText>
          <ShowButton onClick={() => setInfoVisible(true)} aria-label="Show info">
            Info
          </ShowButton>
        </Header>

        {infoVisible && (
          <Overlay onClick={() => setInfoVisible(false)}>
            <InfoBox onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setInfoVisible(false)} aria-label="Close info">
                &times;
              </CloseButton>

              <InfoTitle>About This Generator</InfoTitle>

              <InfoSection>
                This is a personal project built for Dungeon Masters who want quick, narratively
                interesting encounters. Set your party details, hit generate, and use the result
                as inspiration — the XP math is handled for you.
              </InfoSection>

              <InfoDivider />

              <InfoSection>
                <InfoSectionTitle>How XP Works</InfoSectionTitle>
                Encounters follow the official D&D 5e XP budget rules. The more monsters in a
                fight, the harder they are to manage — so the encounter multiplier increases with
                group size. This means adding monsters costs more of your XP budget than their
                raw XP suggests. The XP shown in the breakdown is what players earn if they
                defeat those monsters.
              </InfoSection>

              <InfoSection>
                <InfoSectionTitle>Monster Complications</InfoSectionTitle>
                When the complication is a monster group, those creatures are a separate third
                party — not allied with the main group. They may fight the players, the main
                monsters, or both. They are not counted in the XP budget, so the encounter will
                be more dangerous than it appears. A good framing: the players stumble upon a
                fight already in progress.
              </InfoSection>

              <InfoSection>
                <InfoSectionTitle>Monster Stats</InfoSectionTitle>
                The Stats link searches Open5e, which covers both official D&D monsters and
                third-party content. If a monster does not appear there, try searching by
                name on D&D Beyond or Google.
              </InfoSection>

              <InfoDivider />

              <InfoSection>
                <InfoSectionTitle>Built With AI Assistance</InfoSectionTitle>
                The original site was built with npm and React. The migration to pnpm and Next.js,
                as well as ongoing development of the encounter logic, narrative generation, and
                site improvements, was done with the help of{' '}
                <a
                  href="https://claude.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#7eb8d4', fontWeight: 600 }}
                >
                  Claude
                </a>{' '}
                (Anthropic). All design decisions and content are my own.
              </InfoSection>

              <InfoDivider />

              <InfoSection style={{ fontSize: '0.9rem', color: '#8aabb8' }}>
                Questions or feedback? Reach out via the email in the footer.
              </InfoSection>
            </InfoBox>
          </Overlay>
        )}

        <Main>
          <EncounterGenerator />
        </Main>

        <Footer>
          © {new Date().getFullYear()} Daniel Klausen | Free D&D 5e Encounter Generator |{' '}
          <a href="mailto:danielklausen90@gmail.com">danielklausen90@gmail.com</a>
        </Footer>
      </AppContainer>
    </>
  );
};

export default ArenaApp;
