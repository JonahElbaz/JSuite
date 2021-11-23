import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useSyncData, useUserData} from "../../store/hooks/user.hook.js";
import {useHistory, useParams} from 'react-router-dom';
import Title from "../../components/Title.js";
import moment from 'moment';
import {config} from "../../config";
import styled from "styled-components";
import {Button, EntryContainer, FlexBox} from "../../styles";
import {AddCircle, Book, CaretForwardOutline, Close, Cog, Pencil, StatsChart} from "react-ionicons";
import {useQueryClient} from "react-query";
import firebase from "firebase";
import 'firebase/auth'
import {debounce} from "lodash";
import LineEntry from "../../components/LineEntry.js";
import DayStats from "../../components/DayStats.js";
import {Calendar, DateRangePicker} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import {useToasts} from "react-toast-notifications"; //
import uuid from 'react-uuid'

const Notebook = ({}) => {
  const {addToast} = useToasts()
  const {
    data: {
      data
    }
  } = useUserData()
  const companyListSettings = data?.settings?.companyListSettings || {
    hidden: [],
    recurring: []
  };
  const notebooks = data?.content?.notebooks || {}
  const {nbid} = useParams()
  const nb = notebooks[nbid]
  const entries = nb.entries || [];
  const queryClient = useQueryClient()
  const history = useHistory()
  const [visibleWeeks, setVisibleWeeks] = useState([])
  const [allEntries, setAllEntries] = useState([])
  const [renderedGroups, setRenderedGroups] = useState({})
  const [newEntry, setNewEntry] = useState(false);
  const [seeMore, setSeeMore] = useState(null)
  const [changeDate, setChangeDate] = useState(null)
  const [showDateRange, setShowDateRange] = useState(false)
  const runSync = useSyncData()
  const updateHandlerRef = useRef()
  updateHandlerRef.current = () => runSync.mutate({data});

  const updateHandler = useCallback(debounce((...args) => {
    return updateHandlerRef.current(...args)
  }, 1000), [renderedGroups]);

  useEffect(() => {
    setVisibleWeeks([
      moment().startOf('isoWeek').format(config.dates.format),
      moment().subtract(1, 'week').startOf('isoWeek').format(config.dates.format)
    ])
  }, [entries])

  useEffect(() => {
    loadWeeks()
  }, [visibleWeeks])

  useEffect(() => {
    if (entries && !Object.keys(renderedGroups).length) {
      let en = entries.sort((a, b) => {
        return a.date < b.date ? 1 : a.date === b.date ? 0 : -1
      })
      setAllEntries(en);
    }
  }, [])

  const loadWeeks = () => {
    const visible = {};
    allEntries.forEach(entry => {
      const date = moment(entry.date, config.dates.format).startOf('isoWeek').format(config.dates.format);
      if (visibleWeeks.indexOf(date) > -1) {
        if (visible[entry.date]) {
          visible[entry.date].push(entry)
        } else {
          visible[entry.date] = [entry]
        }
      }
    })

    setRenderedGroups(visible);
  }

  const deleteGroup = (group) => {
    const rg = {...renderedGroups};
    delete rg[group];
    setRenderedGroups(rg);

    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      oldData.data.content.notebooks[nbid].entries = oldData.data.content.notebooks[nbid].entries.filter(o => o.date !== group);
      return oldData
    })

    setAllEntries(allEntries.filter(o => o.date !== group))

    updateHandler()
  }

  const deleteEntry = (group, entry) => {
    const rg = {...renderedGroups};
    const index = rg[group].findIndex(o => o.id === entry);
    rg[group].splice(index, 1);
    setRenderedGroups(rg);

    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      const i = oldData.data.content.notebooks[nbid].entries.findIndex(o => o.id === entry);
      if (i > -1) {
        oldData.data.content.notebooks[nbid].entries.splice(i, 1);
      }
      return oldData
    })

  }

  const onChange = (ev, group, entry, field) => {
    const rg = {...renderedGroups};
    const index = rg[group].findIndex(o => o.id === entry);
    rg[group][index][field] = ev.target.value;
    setRenderedGroups(rg);

    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      const i = oldData.data.content.notebooks[nbid].entries.findIndex(o => o.id === entry);
      if (i > -1) {
        oldData.data.content.notebooks[nbid].entries[i] = rg[group][index]
      } else {
        oldData.data.content.notebooks[nbid].entries.push(rg[group][index])
      }
      return oldData
    })

    updateHandler()
  }

  const selectedOption = (ev, group) => {
    if (ev.target.value === 'select') {
      return;
    }
    const newEntry = {
      date: group,
      end: "",
      endLogged: "",
      id: uuid(),
      isValidLogged: false,
      isValidRange: false,
      notes: "",
      start: "",
      startLogged: "",
      title: ev.target.value
    }

    const rg = {...renderedGroups};
    rg[group].unshift(newEntry);
    setRenderedGroups(rg);

    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      oldData.data.content.notebooks[nbid].entries.push(newEntry)
      return oldData
    })

    updateHandler()
    setNewEntry(false)
  }

  const updateDate = (oldDate, newDate) => {
    newDate = moment(newDate).format(config.dates.format);
    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      const entries = oldData.data.content.notebooks[nbid].entries;
      entries.forEach((en, idx) => {
        if (en.date === oldDate) {
          entries[idx].date = newDate
        }
      })
      return oldData
    })
    setTimeout(() => {
      loadWeeks()
    }, 500);
    setChangeDate(null);
    updateHandler()
  }

  const addNextDate = () => {
    let date = moment().format(config.dates.format);
    const rg = {...renderedGroups};
    while (rg[date] && rg[date].length) {
      date = moment(date, config.dates.format).add(1, 'day').format(config.dates.format)
    }
    rg[date] = [];
    if (companyListSettings.recurring && companyListSettings.recurring.length) {
      for (const entry of companyListSettings.recurring) {
        const e  = {...entry}
        e.id = uuid();
        if (rg[date].findIndex(o => o.title === e.title) === -1) {
          rg[date].push({
            ...e,
            date
          })
        }
      }
    }
    setRenderedGroups(rg);
    addToast('Entry added', {appearance: 'success', autoDismiss: true});

    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      for (const e of rg[date]) {
        oldData.data.content.notebooks[nbid].entries.push(e);
      }
      return oldData
    })
    updateHandler()
  }

  const getCurrentRange = () => {
    let largestDate = null
    let smallestDate = null
    for (const date of visibleWeeks) {
      if (!largestDate) {
        largestDate = date;
      }

      if (!smallestDate) {
        smallestDate = date;
      }

      if (date > largestDate) {
        largestDate = date;
      }

      if (date < smallestDate) {
        smallestDate = date;
      }
    }

    return {
      largestDate, smallestDate
    }
  }

  const setNewVisibleWeeks = (start, end) => {

    const lastWeek = moment(end).startOf('isoWeek').format(config.dates.format);
    const firstWeek = moment(start).startOf('isoWeek').format(config.dates.format);

    const weeks = [firstWeek];
    let addingWeek = firstWeek

    while (addingWeek !== lastWeek && addingWeek.length <= 500) {
      addingWeek = moment(addingWeek).add(1, 'week').format(config.dates.format);
      weeks.push(addingWeek);
    }

    setVisibleWeeks(weeks)
  }


  const visibleRange = getCurrentRange();

  return (
    <div style={{padding: 12}}>

      {showDateRange &&
      <ModalContainer>
        <DateRangePicker
          showDateDisplay={false}
          showSelectionPreview={false}
          showPreview={false}
          ranges={[{
            startDate: moment(visibleRange.smallestDate, config.dates.format).toDate(),
            endDate: moment(visibleRange.largestDate, config.dates.format).toDate(),
          }]}
          onChange={(res) => {
            if (res.range1 && res.range1.startDate.toString() !== res.range1.endDate.toString()) {
              setShowDateRange(false)
            }
            setNewVisibleWeeks(res.range1.startDate.toString(), res.range1.endDate.toString());
          }}
        />
      </ModalContainer>
      }

      {!!changeDate &&
      <ModalContainer>
        <Calendar
          date={moment(changeDate).toDate()}
          showDateDisplay={false}
          showSelectionPreview={false}
          showPreview={false}
          onChange={(res) => {
            updateDate(changeDate, res)
          }}
        />
      </ModalContainer>
      }

      <FlexBox justify={'space-between'} style={{marginRight: 12}}>
        <Title/>
        <FlexBox>
          <StatsChart
            color={'white'}
            height="18px"
            width="18px"
            style={{cursor: 'pointer'}}
            onClick={() => history.push('/settings/reports')}
          />
          <Book
            color={'white'}
            height="20px"
            width="20px"
            style={{cursor: 'pointer', marginLeft: 20}}
            onClick={() => history.push('/notebooks')}
          />
          <Cog
            color={'white'}
            height="20px"
            width="20px"
            style={{cursor: 'pointer', marginLeft: 20}}
            onClick={() => history.push('/settings')}
          />
        </FlexBox>
      </FlexBox>
      <h3 style={{marginBottom: 6}}>
        {nb.title}
        <AddCircle
          color={config.colors.primary}
          height="20px"
          width="20px"
          style={{cursor: 'pointer', position: 'relative', top: 3, left: 6}}
          onClick={addNextDate}
        />
      </h3>

      <FlexBox>
        <div style={{
          fontSize: 12,
          color: config.colors.textPrimary
        }}>{visibleRange.smallestDate} - {visibleRange.largestDate} ({visibleWeeks.length} week{visibleWeeks.length > 1 ? 's' : ''})
        </div>
        <Pencil
          color={'white'}
          height="12px"
          width="12px"
          style={{cursor: 'pointer', position: 'relative', left: 8, top: -2, opacity: 0.7}}
          onClick={() => setShowDateRange(true)}
        />
      </FlexBox>

      <div>
        {Object.keys(renderedGroups).sort((a, b) => a < b ? 1 : -1).map(date => {
          return (
            <DayContainer key={date}>
              <FlexBox justify={'space-between'}>
                <div className={'date'}>{moment(date).format('dddd, MMM DD YYYY')} <Close
                  color={'white'}
                  height="12px"
                  width="12px"
                  onClick={() => deleteGroup(date)}
                  style={{cursor: 'pointer', position: 'relative', left: 8, top: 0, opacity: 0.7}}
                /></div>

                <FlexBox>
                  <Button warn={newEntry} style={{marginRight: 4}} onClick={() => setNewEntry(!newEntry)}>
                    {newEntry ? 'Cancel' : 'New Entry'}
                  </Button>
                  <Button onClick={() => setChangeDate(date)}>
                    Change Date
                  </Button>
                </FlexBox>
              </FlexBox>

              <DayStats entries={renderedGroups[date]}/>

              <EntryContainer justify={'space-between'}>
                <div className={'title'}>
                  <CaretForwardOutline
                    style={{opacity: 0}}
                    color={'#ffffff'}
                    height="14px"
                    width="14px"
                  />
                  <RowTitle>Job</RowTitle>
                </div>
                <FlexBox align={'center'}>
                  <RowTitle>Logged</RowTitle>
                  <RowTitle>Spent</RowTitle>
                  <RowTitle>Start</RowTitle>
                  <RowTitle>End</RowTitle>
                </FlexBox>

              </EntryContainer>

              {newEntry &&
              <EntryContainer justify={'center'}>
                <select id="optionSelect"
                        style={{width: 200}} onChange={ev => selectedOption(ev, date)}>
                  <option value={'select'}>Select Job</option>
                  {(data.settings?.companyList || []).filter(a => companyListSettings.hidden.indexOf(a) === -1).map(o =>
                    <option value={o}>{o}</option>)}
                </select>
              </EntryContainer>
              }

              {renderedGroups[date].map(entry => (
                <EntryContainer justify={'space-between'} key={entry.id}>
                  <LineEntry setSeeMore={setSeeMore} deleteEntry={deleteEntry} onChange={onChange} entry={entry}
                             date={date} seeMore={seeMore}/>
                </EntryContainer>
              ))
              }
            </DayContainer>
          )
        })
        }
      </div>
    </div>
  );
};

export default Notebook;


const DayContainer = styled.div`
  border-top: thin solid ${config.colors.primary};
  padding-top: 20px;

  .date {
    font-size: 14px;
    opacity: 0.8;
  }

  margin-bottom: 20px;
`

const RowTitle = styled.span`
  text-decoration: underline;
  width: 66px;
  font-size: 12px;
  text-align: center;
  margin-right: 1px;
`

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

