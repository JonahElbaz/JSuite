import React from 'react'
import {CaretForwardOutline} from "react-ionicons";
import {Button, EntryInput, FlexBox} from "../styles";

const LineEntry = ({entry, onChange, date, seeMore, deleteEntry, setSeeMore}) => {

  return (
    <>
      <div className={'title'}>
        {!!setSeeMore && <CaretForwardOutline
          color={'#ffffff'}
          height="14px"
          width="14px"
          style={{cursor: 'pointer'}}
          onClick={() => setSeeMore(date + ':::' + entry.id)}
        />}
        {entry.title}
      </div>
      {seeMore !== `${date}:::${entry.id}` ? <FlexBox align={'center'}>
        <EntryInput
          value={entry.startLogged}
          placeholder={'Xh'}
          onChange={ev => onChange(ev, date, entry.id, 'startLogged')}
        />
        <EntryInput
          value={entry.endLogged}
          placeholder={'Xh'}
          onChange={ev => onChange(ev, date, entry.id, 'endLogged')}
        />
        <EntryInput
          value={entry.start}
          placeholder={'00:00'}
          onChange={ev => onChange(ev, date, entry.id, 'start')}
        />
        <EntryInput
          value={entry.end}
          placeholder={'12:00'}
          onChange={ev => onChange(ev, date, entry.id, 'end')}
        />
      </FlexBox> : <FlexBox align={'center'}>
        <Button onClick={() => deleteEntry(date, entry.id)} warn>Delete Entry</Button>
        <Button style={{marginLeft: 4}} onClick={() => setSeeMore(null)}>Cancel</Button>
      </FlexBox>}
    </>
  );
};

export default LineEntry;
