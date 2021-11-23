import React from "react"
import { Button, EntryInput, FlexBox, ListContainer, ListItem } from "../../styles"
import Title from "../../components/Title.js"
import { Book, ChevronForward } from "react-ionicons"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { useSyncData, useUserData } from "../../store/hooks/user.hook.js"
import firebase from "firebase"
import "firebase/app"
import { useQueryClient } from "react-query"
import { config } from "../../config"
import { useToasts } from "react-toast-notifications"
import CenterLoader from "../../components/CenterLoader.js"

const Settings = ({}) => {
	const { addToast } = useToasts()
	const history = useHistory()
	const queryClient = useQueryClient()
	const { data: { data }, isFetching } = useUserData()
	const runSync = useSyncData()
	const settings = data?.settings

	const reSyncData = async () => {
		try {
			await queryClient.refetchQueries(["user", firebase.auth().currentUser?.uid])
			addToast("Data synced", { appearance: "success", autoDismiss: true })
		} catch (e) {
			addToast("There was an error syncing your data - " + e, { appearance: "error" })
		}

	}

	const onChange = (ev, field) => {
		queryClient.setQueryData(["user", firebase.auth().currentUser.uid], oldData => {
			oldData.data.settings[field] = ev.target.value
			return oldData
		})
	}

	const onBlur = () => {
		runSync.mutate({ data })
	}

	const spacing = config.spacing.padding

	return (
		<div>
			{isFetching && <CenterLoader/>}
			<FlexBox justify={"space-between"} style={{ marginRight: spacing, padding: spacing }}>
				<Title/>
				<FlexBox>
					<Book
						color={"white"}
						height="20px"
						width="20px"
						style={{ cursor: "pointer" }}
						onClick={() => history.push("/notebooks")}
					/>
				</FlexBox>
			</FlexBox>

			<div>

				<FlexBox align={"center"} justify={"space-between"} style={{ padding: spacing }}>
					<SectionTitle>Hourly Wage ($/h)</SectionTitle>

					<EntryInput
						value={settings?.wage}
						placeholder={"12:00"}
						type={"number"}
						onBlur={onBlur}
						onChange={ev => onChange(ev, "wage")}
					/>
				</FlexBox>

				<ListContainer>
					<ListItem style={{ paddingLeft: spacing }} onClick={() => {
						history.push("/settings/manage")
					}}>
						<div>
							Manage Companies
						</div>
						<ChevronForward
							color={"#00000"}
							height="24px"
							width="24px"
						/>
					</ListItem>
					<ListItem style={{ paddingLeft: spacing }} onClick={() => {
						history.push("/settings/recurring")
					}}>
						<div>
							Manage Recurring
						</div>
						<ChevronForward
							color={"#00000"}
							height="24px"
							width="24px"
						/>
					</ListItem>
					<ListItem style={{ paddingLeft: spacing }} onClick={() => {
						history.push("/settings/reports")
					}}>
						<div>
							Reports
						</div>
						<ChevronForward
							color={"#00000"}
							height="24px"
							width="24px"
						/>
					</ListItem>
				</ListContainer>

			</div>

			<FlexBox align={"center"} justify={"center"} style={{ marginTop: 20 }}>
				<Button disabled={isFetching} style={{ width: 100 }} onClick={reSyncData}>Sync Data</Button>

				<Button style={{ marginLeft: 12, width: 100 }} onClick={() => {
					(async () => {
						await queryClient.invalidateQueries(["user", firebase.auth().currentUser?.uid])
						firebase.auth().signOut()
					})()
				}} warn>Logout</Button>
			</FlexBox>
		</div>
	)
}

export default Settings

const SectionTitle = styled.div`
	font-size: 15px;

`
