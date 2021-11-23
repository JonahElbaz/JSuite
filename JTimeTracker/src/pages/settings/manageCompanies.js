import React, {useState} from 'react'
import {Button, EntryInput, FlexBox, ListContainer, ListItem} from "../../styles";
import Title from "../../components/Title.js";
import {AddCircle, ArrowBack} from "react-ionicons";
import {config} from "../../config";
import {useHistory} from "react-router-dom";
import {useSyncData, useUserData} from "../../store/hooks/user.hook.js";
import firebase from "firebase";
import {useQueryClient} from "react-query";
import Calculations from "../../utils/calculations.js";

const ManageCompanies = ({}) => {
  const [addItem, setAddItem] = useState(null)
  const {data: {data}} = useUserData()
  const spacing = config.spacing.padding
  const history = useHistory()
  const settings = data.settings || {};
  const companyListSettings = data.settings.companyListSettings || {
    hidden: [],
    recurring: []
  };
  const runSync = useSyncData()
  const queryClient = useQueryClient()

  const leaveAndSync = () => {
    runSync.mutate({data})
    history.push('/settings');
  }

  const addNewEntry = () => {
    if (addItem && addItem.length) {
      queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
        oldData.data.settings.companyList.push(addItem)
        oldData.calculations = new Calculations(oldData.data.settings)
        return oldData
      })
      setAddItem(null)
    }
  }

  const toggleHideItem = (company) => {
    queryClient.setQueryData(['user', firebase.auth().currentUser.uid], oldData => {
      const list = [...companyListSettings.hidden];
      const foundIndex = companyListSettings.hidden.indexOf(company);
      if (foundIndex > -1) {
        list.splice(foundIndex, 1);
      } else {
        list.push(company)
      }

      oldData.data.settings.companyListSettings = {
        ...companyListSettings,
        hidden: list
      }
      oldData.calculations = new Calculations(oldData.data.settings)
      return oldData
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
            onClick={leaveAndSync}
          />
        </FlexBox>
        <Title/>
      </FlexBox>

      <div>
        <h3 style={{paddingLeft: spacing}}>
          Manage Companies
          <AddCircle
            color={config.colors.primary}
            height="20px"
            width="20px"
            style={{cursor: 'pointer', position: 'relative', top: 4.5, left: 6}}
            onClick={() => setAddItem(addItem === null ? '' : null)}
          />
        </h3>

        {addItem !== null &&
        <FlexBox justify={'center'} align={'center'}>
          <EntryInput
            style={{
              width: 200,
              textAlign: 'left',
              fontSize: 18,
              marginBottom: 6,
              height: 40,
              paddingLeft: 6
            }}
            placeholder={'Company name'}
            value={addItem}
            onChange={e => setAddItem(e.target.value)}
          />
          <Button style={{marginLeft: 12}} disabled={!addItem} onClick={addNewEntry}>Add</Button>
          <Button warn style={{marginLeft: 4}} onClick={() => setAddItem(null)}>Cancel</Button>
        </FlexBox>}
        <ListContainer>
          {[...settings.companyList].reverse().map((company, index) => (
            <ListContainer>
              <ListItem style={{paddingLeft: spacing}}>
                <div>{company}</div>

                {companyListSettings.hidden.indexOf(company) > -1 ?
                  <Button style={{marginLeft: 12}} onClick={() => toggleHideItem(company)}>Add</Button> :
                  <Button warn style={{marginLeft: 12}} onClick={() => toggleHideItem(company)}>Hide</Button>
                }
              </ListItem>
            </ListContainer>
          ))
          }
        </ListContainer>
      </div>
    </div>
  );
};

export default ManageCompanies;
