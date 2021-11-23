import React from 'react'
import {FlexBox} from "../../styles";

const DisplayReport = ({response}) => {

  console.log(1, response)

  if (!response || !response.data || !response.data.template) {
    return <FlexBox align={'center'} justify={'center'} style={{marginTop: 50, color: 'red'}}>Error loading
      report</FlexBox>
  }

  return (
    <div className={'report-container'}>
      <div dangerouslySetInnerHTML={{__html: response.data.template}}/>
    </div>
  );
};

export default DisplayReport;
