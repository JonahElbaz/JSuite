import React from 'react'
import {FlexBox} from "../../styles";
import Title from "../../components/Title.js";
import styled from "styled-components";
import firebase from 'firebase/app';
import 'firebase/auth';
import {useToasts} from 'react-toast-notifications';

const SignIn = ({}) => {
  const {addToast} = useToasts();

  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth()
      .signInWithPopup(provider)
      .then(() => {
        addToast('Logged in', {appearance: 'success', autoDismiss: true});
      }).catch((error) => {
      addToast(error.message, {appearance: 'error'});
    });
  }

  return (
    <FlexBox justify={'center'} align={'center'} direction={'column'} style={{paddingTop: 20}}>
      <Title/>
      <h3>Log In</h3>

      <GoogleButton onClick={googleLogin}>
        <img src="https://img.icons8.com/color/48/000000/google-logo.png"/>
      </GoogleButton>
    </FlexBox>
  );
};

export default SignIn;

const GoogleButton = styled.div`
  width: 100px;
  height: 60px;
  margin-top: 20px;
  text-align: center;
  background-color: white;
  color: #282c34;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #e3e3e3;
  }

`;
