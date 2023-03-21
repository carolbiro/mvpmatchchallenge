import styled from 'styled-components';

export const ProductCartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align:left;
  padding:0 15px;
  position: relative;

  button {
    width: 15%;
    opacity: 0.7;
    display: flex;
  }

  input {
    width:40px;
    padding:0 10px;
    margin-left: 15px;
  }
  &:hover {
    img {
      opacity: 0.8;
    }

    button {
      opacity: 0.85;
      display: flex;
    }
  }
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  margin-bottom:20px;
  justify-content: space-between;
  font-size: 18px;
`;

export const Name = styled.span`
  display: inline-flex;
  align-items: center;
  width: 60%;
`;

export const Price = styled.span`
  display: inline-flex;
  align-items: center;
  width: 10%;
`;

export const Available = styled.span`
  display: inline-flex;
  align-items: center;
  width: 10%;
`;