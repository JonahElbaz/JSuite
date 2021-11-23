import React, {useState} from 'react'
import {FlexBox} from "../styles";
import {BounceLoader} from "react-spinners";

const CenterLoader = ({}) => {

    return (
      <FlexBox align={'center'} justify={'center'} style={{height: '100vh'}}>
          <BounceLoader color={'#fff'} loading={true} size={100}/>
      </FlexBox>
    );
};

export default CenterLoader;
