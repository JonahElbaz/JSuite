import React, {useEffect, useState} from 'react'
import {config} from "../../config";
import {Button, EntryContainer, FlexBox} from "../../styles";
import {ArrowBack} from "react-ionicons";
import Title from "../../components/Title.js";
import {useHistory} from "react-router-dom";
import "react-toggle/style.css" // for ES6 modules
import Toggle from 'react-toggle'
import {DateRangePicker} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import styled from "styled-components"; // theme css file
import moment from 'moment'
import firebase from 'firebase/app';
import 'firebase/functions'
import {useToasts} from "react-toast-notifications";
import CenterLoader from "../../components/CenterLoader.js";
import ReportTemplate from "./reportTemplate.js";
import {useUserData} from "../../store/hooks/user.hook.js";

const Reports = ({}) => {
  const {addToast} = useToasts()
  const spacing = config.spacing.padding
  const [reportParams, setReportParams] = useState({
    type: 'Custom',
    dateRange: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      isSet: false
    },
    totalDays: '',
    startDate: '',
    sendEmail: false
  })
  const [showDateRange, setShowDateRange] = useState(false);
  const history = useHistory()
  const [reportResponse, setReportResponse] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookId, setBookId] = useState(1)

  const {data: {data}, isFetching} = useUserData()
  const notebooks = data?.content?.notebooks || {}

  useEffect(() => {
    if (data && notebooks) {
      setBookId(Object.keys(notebooks)[0])
    }
  }, [data])

  const resetReports = () => {
    setReportParams({
      type: 'Custom',
      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
        isSet: false
      },
      totalDays: '',
      startDate: '',
      sendEmail: false
    })
    setReportResponse(null)
    setShowDateRange(false);
    setLoading(false)
  }

  const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const setDate = (value, unit) => {
    let endDate;
    let startDate;
    if (value === 'today') {
      endDate = moment().endOf('day');
      startDate = moment().startOf('day')
    } else if (value === 'allTime') {
      endDate = moment().endOf('day');
      startDate = moment().startOf('day').subtract(15, 'years');
    } else {
      endDate = moment().endOf('day');
      startDate = moment().startOf('day').subtract(value, unit)
    }

    setReportParams({
      ...reportParams,
      dateRange: {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        isSet: true
      }
    })
  }

  const generateReport = () => {
    const body = {
      hideMail: !reportParams.sendEmail,
      reportType: reportParams.type,
      dateRange: [
        moment(reportParams.dateRange.startDate.toISOString()).format(config.dates.format),
        moment(reportParams.dateRange.endDate.toISOString()).format(config.dates.format)
      ],
      bookIdFilter: [bookId]
    }

    setLoading(true)
    const callable = firebase.functions().httpsCallable('produceReport')
    callable(body).then(data => {
      if (!data.data) {
        throw new Error(data.message);
      }
      setReportResponse(data)
    }).catch(err => {
      addToast('There was an error generating your report - ' + err, {appearance: 'error'});
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div>
      <FlexBox style={{marginRight: spacing, padding: spacing}}>
        <FlexBox>
          <ArrowBack
            color={'white'}
            height="20px"
            width="20px"
            style={{cursor: 'pointer', marginRight: 6}}
            onClick={() => history.push('/settings')}
          />
        </FlexBox>
        <Title/>
        {!!reportResponse && <Button onClick={resetReports} style={{marginLeft: 'auto'}}>Restart</Button>}
      </FlexBox>

      {showDateRange &&
      <ModalContainer>
        <DateRangePicker
          showDateDisplay={false}
          showSelectionPreview={false}
          showPreview={false}
          ranges={[reportParams.dateRange]}
          onChange={(res) => {
            if (res.selection.startDate.toString() !== res.selection.endDate.toString()) {
              setShowDateRange(false)
            }
            setReportParams({
              ...reportParams,
              dateRange: {
                ...res.selection,
                isSet: true
              }
            })
          }}
        />
      </ModalContainer>
      }


      {loading ? <CenterLoader/> : !reportResponse ? <div style={{padding: spacing}}>

        <FlexBox justify={'space-between'}>
          <div>Notebook</div>

          <select id="optionSelect" value={bookId}
                  style={{width: 200}} onChange={ev => setBookId(ev.target.value)}>
            {(Object.keys(notebooks || {})).map(id =>
              <option value={id}>{notebooks[id].title}</option>)}
          </select>

        </FlexBox>

        <FlexBox justify={'space-between'}  style={{marginTop: 30}}>
          <div>Date Range</div>
          <div style={{opacity: 0.7, cursor: 'pointer'}} onClick={() => setShowDateRange(true)}>
            {reportParams.dateRange.isSet ? `${moment(reportParams.dateRange.startDate.toISOString()).format(config.dates.format)} - ${moment(reportParams.dateRange.endDate.toISOString()).format(config.dates.format)}` : 'Pick Date Range'}
          </div>
        </FlexBox>

        <FlexBox justify={'space-between'} style={{marginTop: 30}}>
          <div>Send Email</div>

          <Toggle
            defaultChecked={reportParams.sendEmail}
            onChange={ev => {
              setReportParams({
                ...reportParams,
                sendEmail: ev.target.value === 'on'
              })
            }}/>
        </FlexBox>

        <div style={{marginTop: 30}}>
          <h4 style={{marginBottom: 6}}>Suggestions</h4>
          <FlexBox wrap={'nowrap'} style={{overflowX: 'scroll', width: '100%'}}>
            <Chip onClick={() => setDate('today')}>Today</Chip>
            <Chip onClick={() => setDate(5, 'days')}>5 days</Chip>
            <Chip onClick={() => setDate(7, 'days')}>7 days</Chip>
            <Chip onClick={() => setDate(14, 'days')}>14 days</Chip>
            <Chip onClick={() => setDate(1, 'moth')}>1 month</Chip>
            <Chip onClick={() => setDate(3, 'months')}>3 months</Chip>
            <Chip onClick={() => setDate(1, 'year')}>1 year</Chip>
            <Chip onClick={() => setDate('allTime')}>All time</Chip>

          </FlexBox>
        </div>

        <FlexBox justify={'center'} style={{marginTop: 25}}>
          <Button disabled={reportParams.dateRange.isSet === false} style={{backgroundColor: '#12dd2c'}}
                  onClick={generateReport}>
            Generate Report
          </Button>
        </FlexBox>
      </div> : <ReportTemplate data={reportResponse?.data?.data[0]}/>}
    </div>
  );
};

export default Reports;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 9999;
  background-color: white;
`

const Chip = styled.div`
  min-width: 100px;
  margin: 4px;
  height: 30px;
  border-radius: 30px;
  background-color: ${config.colors.primary};
  color: white;

  line-height: 28px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: white;
    color: ${config.colors.primary};
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`
