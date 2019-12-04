import styled from 'styled-components';
import React from 'react';

const StyledComponents = {
  Banner: styled.div`
    background-image: ${(props) => `url(${props.image})`};
    background-size: cover;
    background-color: transparent;
    padding: 100px 0;
    width: 100%;
    height: 40vh;

    @media screen and (max-width: 480px) {
      padding: 0;
    }
  `,
  BannerHeadingWrapper: ({children}) => (
    <div style={{
      textAlign: 'center',
      padding: '10px',
      background: 'rgba(255, 255, 255, .35)',
      color: '#000',
    }}>{children}</div>
  ),

  SeeMoreButton: ({children}) => (
    <div style={{
      textAlign: 'center',
      padding: '1.5em',
      cursor: 'pointer',
      borderRadius: '10px',
      background: '#000',
      fontSize: '1em',
      color: 'white',
    }}>{children}</div>
  ),

  Heading: ({children}) => (
    <p style={{
      textAlign: 'center',
      color: 'rgba(0, 0, 0, .90)',
      margin: '4px auto',
      fontSize: '1.1em',
      textTransform: 'uppercase',
      fontWeight: '600',
    }}>{children}</p>
  ),

  BlackButton: ({children}) => (
    <div style={{
      color: 'rgba(255, 255, 255, .85)',
      padding: '10px 20px',
      background: '#000',
      textTransform: 'uppercase',
    }}>{children}</div>
  ),

  Error: ({children}) => (
    <p style={{
      fontSize: '13px',
      fontWeight: 500,
      color: 'red',
    }}>
      {children}
    </p>
  ),

};

export default StyledComponents;
