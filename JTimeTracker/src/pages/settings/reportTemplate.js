import React from 'react'
import moment from "moment";
import {FlexBox} from "../../styles";
import styled from "styled-components";
import {config} from "../../config";
import Numeral from 'numeral'

const ReportTemplate = ({data}) => {

  const rangeDifference = () => {
    const dates = data.dateRange.split(' - ');
    const days = moment(dates[1], 'MMM DD YYYY').diff(moment(dates[0], 'MMM DD YYYY'), 'days')
    return days + (days === 1 ? ' day' : ' days');
  }

  return (
    <div style={{paddingBottom: 50}}>
      <h4 style={{textAlign: 'center', marginBottom: 0}}>{data.dateRange}</h4>
      <h6 style={{textAlign: 'center', marginTop: 10}}>{rangeDifference()}</h6>
      <FlexBox style={{marginBottom: 20}}>
        <FlexBox dir={'column'} style={{width: '100%'}}>
          <Title>
            Amount Earned
          </Title>
          <Data>
            <span>
            {Numeral(data.amountEarned).format('$0,0.00')}
              <SubData>
              &nbsp; ({Numeral(data.amountUp).format('$0,0.00')})
            </SubData>
            </span>
          </Data>
        </FlexBox>
      </FlexBox>
      <FlexBox style={{marginBottom: 20}}>
        <FlexBox dir={'column'} style={{width: '50%'}}>
          <Title>
            Billable Hours
          </Title>
          <Data>
            <span>
            {data.amountBilled} hours
            </span>
          </Data>
        </FlexBox>
        <FlexBox dir={'column'} style={{width: '50%'}}>
          <Title>
            Spent Hours
          </Title>
          <Data>
            <span>
            {data.amountWorked} hours
            </span>
          </Data>
        </FlexBox>
      </FlexBox>

      <FlexBox style={{marginBottom: 50}}>
        <FlexBox dir={'column'} style={{width: '50%'}}>
          <Title>
            Average Rate
          </Title>
          <Data>
            <span>
            {Numeral(data.listedRate).format('$0,0.00')}/h
            </span>
          </Data>
        </FlexBox>
        <FlexBox dir={'column'} style={{width: '50%'}}>
          <Title>
            Effective Rate
          </Title>
          <Data>
            <span>
            {Numeral(data.effectiveRate).format('$0,0.00')}/h
            </span>
          </Data>
        </FlexBox>
      </FlexBox>

      <div style={{paddingLeft: 30}}>
        <Title>
          Breakdown
        </Title>

        <Table>

          <tr>
            <th><span>Job</span></th>
            <th><span>Billable</span></th>
            <th><span>Worked</span></th>
            <th><span>Earned</span></th>
          </tr>

          {data.companyBreakdown.map(entry => (
            <tr>
              <td>{entry.name}</td>
              <td>{entry.logged}h</td>
              <td>{entry.worked}h</td>
              <td style={{color: config.colors.textPrimary}}>{Numeral(entry.earned).format('$0,0.00')}</td>
            </tr>
          ))
          }
        </Table>
        <table style={{borderTop: `thin dotted ${config.colors.textPrimary}`, width: '100%', marginTop: 12, paddingTop: 12}}>
          <tr>
            <td style={{width: 50}}>Total</td>
            <td style={{color: config.colors.textPrimary}}>{Numeral(data.amountEarned).format('$0,0.00')}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default ReportTemplate;

const Title = styled.div`
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`

const Data = styled.div`
  font-size: 14px;
  margin-top: 4px;
  color: ${config.colors.textPrimary};

  span {
    border-bottom: thin dotted ${config.colors.textPrimary};
  }
`;

const SubData = styled.span`
  opacity: 0.7;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 12px;
  
  td {
    font-size: 14px;
    line-height: 20px;
  }

  th {
    text-align: left;
    font-weight: 500;

    span {
      border-bottom: thin dotted white;
    }
  }
`;
