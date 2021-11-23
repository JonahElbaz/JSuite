import React, {useEffect, useState} from 'react'
import {useUserData} from "../../store/hooks/user.hook.js";
import Title from "../../components/Title.js";
import {config} from "../../config";
import {AddCircle, ChevronForward, Cog} from 'react-ionicons'
import {useHistory} from 'react-router-dom';
import {Button, FlexBox, ListContainer, ListItem, NewEntryInput, TextButton} from "../../styles";
import firebase from "firebase/app";
import 'firebase/auth';
import moment from 'moment'
import {useQueryClient} from "react-query";
import CenterLoader from "../../components/CenterLoader.js";

const Notebooks = ({}) => {
  const queryClient = useQueryClient()
  const history = useHistory()
  const [addNotebook, setAddNotebook] = useState(null)
  const {data: {data}, isFetching} = useUserData()
  const notebooks = data?.content?.notebooks || {}

  const notebookArr = Object.keys(notebooks);

  useEffect(() => {
    if (notebookArr.length === 0 && !isFetching) {
      setAddNotebook('');
    } else if (addNotebook !== null) {
      setAddNotebook(null);
    }
  }, [data])

  const selectNotebook = (nbid) => {
    history.push(`/notebooks/${nbid}`)
  }

  const addNewNotebook = () => {
    const id = moment().valueOf().toString()
    const d = data;
    d.content.notebooks[id] = {
      entries: [],
      id,
      title: addNotebook
    }
    queryClient.setQueryData(['user', firebase.auth().currentUser?.uid], {data: d});
    setAddNotebook(null)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
      ...d
    })
  }

  const addFirstBook = () => {
    const id = moment().valueOf().toString()
    const defaultEntry = {
      content: {
        notebooks: {
          [id]: {
            entries: [],
            title: addNotebook,
            id: id
          }
        },
        selectedNotebook: id
      },
      settings: {
        escaped: 'h',
        loggedFormat: 'hours',
        timeFormat: 'military',
        wage: '0',
        companyList: [],
        companyListSettings: {
          hidden: [],
          recurring: []
        }
      },
      uid: firebase.auth().currentUser.uid,
      email: firebase.auth().currentUser.email
    }

    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set(defaultEntry).then(() => {
      queryClient.refetchQueries(['user', firebase.auth().currentUser?.uid]);
      setAddNotebook(null)
    })
  }

  if (isFetching) {
    return (
      <CenterLoader/>
    )
  }

  if (notebookArr.length === 0 && !isFetching) {
    return (
      <div>
        <FlexBox justify={'space-between'} style={{marginRight: 12, padding: 12}}>
          <Title/>
        </FlexBox>

        <FlexBox dir={'column'}>
          <h3>Add a Notebook</h3>
          <NewEntryInput style={{marginLeft: 0}} placeholder={'Notebook title'} value={addNotebook} onChange={ev => {
            setAddNotebook(ev.target.value);
          }}/>

          <Button style={{marginTop: 20, width: 100}} onClick={addFirstBook}>Add</Button>
        </FlexBox>

      </div>
    )
  }

  return (
    <div>
      <FlexBox justify={'space-between'} style={{marginRight: 12, padding: 12}}>
        <Title/>
        <FlexBox>
          <Cog
            color={'white'}
            height="20px"
            width="20px"
            style={{cursor: 'pointer', marginLeft: 20}}
            onClick={() => history.push('/settings')}
          />
        </FlexBox>
      </FlexBox>
      <h3 style={{paddingLeft: 12, marginTop: 20, marginBottom: 6}}>
        Notebooks
        {/*<AddCircle*/}
        {/*  color={config.colors.primary}*/}
        {/*  height="20px"*/}
        {/*  width="20px"*/}
        {/*  style={{cursor: 'pointer', position: 'relative', top: 3, left: 6}}*/}
        {/*  onClick={() => setAddNotebook('')}*/}
        {/*/>*/}
      </h3>

      {addNotebook !== null && <FlexBox style={{marginBottom: 20}}>
        <NewEntryInput placeholder={'Notebook title'} value={addNotebook} onChange={ev => {
          setAddNotebook(ev.target.value);
        }}/>
        <TextButton onClick={addNewNotebook}>Save</TextButton>
        <TextButton style={{color: 'white'}} onClick={() => setAddNotebook(null)}>Cancel</TextButton>
      </FlexBox>}
      <ListContainer>
        {Object.keys(notebooks).map(nbid => {
          const nb = notebooks[nbid];
          return (
            <ListItem key={nbid} onClick={() => selectNotebook(nbid)}
            >
              <div>{nb.title}</div>
              <ChevronForward
                color={'#00000'}
                height="24px"
                width="24px"
              />
            </ListItem>
          )
        })

        }
      </ListContainer>
    </div>
  );
};

export default Notebooks;

