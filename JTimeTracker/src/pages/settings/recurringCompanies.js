import React, {useState} from 'react'
import {Button, EntryContainer, FlexBox} from "../../styles";
import {ArrowBack} from "react-ionicons";
import Title from "../../components/Title.js";
import {config} from "../../config";
import {useSyncData, useUserData} from "../../store/hooks/user.hook.js";
import {useQueryClient} from "react-query";
import {useHistory} from "react-router-dom";
import moment from "moment";
import LineEntry from "../../components/LineEntry.js";
import firebase from "firebase";
import Calculations from "../../utils/calculations.js";
import DayStats from "../../components/DayStats.js";

const RecurringCompanies = ({}) => {
  const [addItem, setAddItem] = useState(false)
  const [seeMore, setSeeMore] = useState(null)

  const spacing = config.spacing.padding
  const {data: {data, calculations}} = useUserData()
  const companyListSettings = data.settings.companyListSettings || {
    hidden: [],
    recurring: []
  };
  const runSync = useSyncData()
  const queryClient = useQueryClient()
  const history = useHistory()

  const [newTempList, setNewTempList] = useState(companyListSettings.recurring);

  const leaveAndSync = () => {
    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      oldData.data.settings.companyListSettings = {
        ...companyListSettings,
        recurring: newTempList
      }
      oldData.calculations = new Calculations(oldData.data.settings)
      return oldData
    })

    runSync.mutate({data})
    history.push('/settings');
  }

  const onChange = (ev, group, entry, field) => {
    const tl = [...newTempList];
    const i = tl.findIndex(o => o.id === entry);
    tl[i][field] = ev.target.value;
    setNewTempList(tl);
  }

  const removeEntry = (index) => {
    const tl = [...newTempList];
    tl.splice(index, 1);
    setNewTempList(tl);
    setSeeMore(null);
  }

  const selectedOption = (ev) => {
    const company = ev.target.value;
    if (company !== 'select') {
      const tl = [...newTempList];
      tl.push({
        date: '',
        end: "",
        endLogged: "",
        id: moment().valueOf(),
        isValidLogged: false,
        isValidRange: false,
        notes: "",
        start: "",
        startLogged: "",
        title: company
      })
      setNewTempList(tl);
      setAddItem(false)
    }
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
            onClick={leaveAndSync}
          />
        </FlexBox>
        <Title/>
      </FlexBox>


      <div style={{padding: spacing, paddingTop: 0}}>
        <FlexBox justify={'space-between'} align={'center'}>
          <h3>
            Manage Recurring
          </h3>
          <Button onClick={() => setAddItem(!addItem)} warn={addItem}>
            {addItem ? 'Cancel' : 'Add Entry'}
          </Button>
        </FlexBox>

        <DayStats entries={newTempList}/>

        {addItem &&
        <EntryContainer justify={'center'}>
          <select id="optionSelect"
                  style={{width: 200}} onChange={ev => selectedOption(ev)}>
            <option value={'select'}>Select Job</option>
            {(data.settings?.companyList || []).filter(a => companyListSettings.hidden.indexOf(a) === -1).map(o =>
              <option value={o}>{o}</option>)}
          </select>
        </EntryContainer>
        }

        {newTempList.map((o, i) => (
          <EntryContainer justify={'space-between'} key={o.id}>
            <LineEntry seeMore={seeMore} deleteEntry={() => removeEntry(i)} setSeeMore={setSeeMore} onChange={onChange}
                       entry={o} date={o.date}/>
          </EntryContainer>
        ))}
      </div>
    </div>
  );
};

export default RecurringCompanies;
