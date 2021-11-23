import React from 'react'
import {FlexBox} from "../styles";
import {useUserData} from "../store/hooks/user.hook.js";

const DayStats = ({entries}) => {
  const {
    data: {
      calculations
    }
  } = useUserData()
  const dayStats = calculations.calculateWorkingDayStats(entries);

  return (
    <FlexBox style={{fontSize: 12, marginTop: 6, marginBottom: 12}}>
      <div>
        <strong>Earned: </strong>
        ${dayStats.totalEarned}
      </div>
      <div style={{marginLeft: 12}}>
        <strong>Logged: </strong>
        {dayStats.totalLogged}h
      </div>
      <div style={{marginLeft: 12}}>
        <strong>Worked: </strong>
        {dayStats.totalWorked}h
      </div>
    </FlexBox>
  );
};

export default DayStats;
