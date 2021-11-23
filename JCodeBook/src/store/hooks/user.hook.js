import { useMutation, useQuery, useQueryClient } from "react-query"
import firebase from "firebase/app"
import "firebase/firestore"
import { useToasts } from "react-toast-notifications"

export const MAIN_QUERY = () => ["user", firebase.auth().currentUser?.uid]

export const useUserData = () => {
	return useQuery(["user", firebase.auth().currentUser?.uid], async () => {
		const data = await firebase.firestore().collection("codeBlocks")
			.where("access", "array-contains", firebase.auth().currentUser.uid)
			.get().then(data => data.docs.map(o => ({
				id: o.id,
				...o.data()
			})))
		return {
			data
		}

	}, {
		staleTime: Infinity,
		enabled: !!firebase.auth().currentUser?.uid,
		placeholderData: {
			data: null
		}
	})
}

export const useRunDeleteCodeBlock = () => {
	const { addToast } = useToasts()
	const queryClient = useQueryClient()
	return useMutation(async (data) => {
		console.log(data)
		await firebase.firestore().collection("codeBlocks").doc(data.id).delete()
		queryClient.setQueryData(["user", firebase.auth().currentUser?.uid], oldData => {
			let arr = oldData ? oldData.data || [] : []
			const i = arr.findIndex(o => o.id === data.id);
			arr.splice(i, 1);
			return { data: arr }
		})
	}, {
		onError: (error) => {
			addToast("Unable to sync with server - " + error, { appearance: "error" })
		},
		onSuccess: () => {
			addToast("Code block deleted", { appearance: "success", autoDismiss: true, autoDismissTimeout: 1000 })
		}
	})

}

export const useRunUpdateCodeBlock = () => {
	const { addToast } = useToasts()
	const queryClient = useQueryClient()
	return useMutation(async (data) => {
		let doc
		let obj = {
			...data
		}
		console.log(obj)
		if (obj.id) {
			doc = firebase.firestore().collection("codeBlocks").doc(obj.id)
		} else {
			doc = firebase.firestore().collection("codeBlocks").doc()
			obj = {
				...obj,
				id: doc.id,
				author: firebase.auth().currentUser.uid,
				access: [firebase.auth().currentUser.uid]
			}
		}
		console.log(obj, firebase.auth().currentUser.uid)
		await doc.set(obj, {merge: true})
		queryClient.setQueryData(["user", firebase.auth().currentUser?.uid], oldData => {
			let data = oldData ? oldData.data || [] : []
			const i = data.findIndex(o => o.id === obj.id);
			if (i > -1) {
				data[i] = obj;
			} else {
				data.push(obj)
			}
			return { data }
		})
	}, {
		onError: (error) => {
			addToast("Unable to sync with server - " + error, { appearance: "error" })
		},
		onSuccess: () => {
			addToast("Code block saved", { appearance: "success", autoDismiss: true, autoDismissTimeout: 1000 })
		}
	})
}

export const useSyncData = () => {
	const { addToast } = useToasts()
	return useMutation(({ data }) => {
		alert("Fix")
		// return firebase.firestore().collection("codeBlocks").doc(firebase.auth().currentUser.uid).set({
		// 	...data
		// }, { merge: true })
	}, {
		onError: (error) => {
			addToast("Unable to sync with server - " + error, { appearance: "error" })
		},
		onSuccess: () => {
			console.log("Data synced")
		}
	})
}
