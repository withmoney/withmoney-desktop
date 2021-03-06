import styled from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100vh;
  background-color: var(--page-background-color);
`;

export const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  margin-top: 15px;
  position: relative;
`;
