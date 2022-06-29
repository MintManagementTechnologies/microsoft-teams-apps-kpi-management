import './SearchBox.scss';

import { useEffect } from 'react';

import { Input, SearchIcon } from '@fluentui/react-northstar';

import { log } from '../../../../common/utils/customConsoleLog';
import { useAppDispatch } from '../../../../store';
import { searchQueryChanged } from '../../filtersSlice';

const SearchBox = (props: {disabled?: boolean}): JSX.Element => {
   const { disabled } = props;
    const dispatch = useAppDispatch();
    

   useEffect(() => {
      if (disabled) {
         log('useEffect - SearchBox', 'success');
         dispatch(searchQueryChanged(''));
      }
   }, [dispatch, disabled]);

    return (
        <Input inverted fluid role="search"
            placeholder={'Find'}
            icon={<SearchIcon />}
            onChange={(event: any) => dispatch(searchQueryChanged(event.target.value.toLowerCase()))}
            disabled={props.disabled} 
        // onChange={(event: any) => dispatch({ type: 'SEARCHTEXT_FILTERS', searchText: event.target.value.toLowerCase() })}
        />
    );
}

export default SearchBox;