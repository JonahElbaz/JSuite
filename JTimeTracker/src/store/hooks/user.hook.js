import {useMutation, useQuery} from "react-query";
import firebase from 'firebase/app'
import 'firebase/firestore';
import Calculations from "../../utils/calculations.js";
import {useToasts} from "react-toast-notifications";

export const useUserData = () => {
  return useQuery(['user', firebase.auth().currentUser?.uid], async () => {
    const data = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get().then(data => data.data());
    return {
      data,
      calculations: new Calculations(data?.settings)
    }

  }, {
    staleTime: Infinity,
    enabled: !!firebase.auth().currentUser?.uid,
    placeholderData: {
      data: null,
      calculations: null
    }
  })
}

export const useSyncData = () => {
  const {addToast} = useToasts()
  return useMutation(({data}) => {
    return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
      ...data
    }, {merge: true})
  }, {
    onError: (error) => {
      addToast('Unable to sync with server - ' + error, {appearance: 'error'});
    },
    onSuccess: () => {
      console.log('Data synced');
    }
  })
}
