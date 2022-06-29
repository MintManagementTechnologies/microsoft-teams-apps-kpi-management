import * as React from 'react';

import {
    Button, Checkbox, Divider, FilterIcon, Flex, FlexItem, Popup, Text
} from '@fluentui/react-northstar';

import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { FilterBatchStatusOptions, filterChanged } from '../../filtersSlice';

const Filters = (props: {disabled?: boolean}): JSX.Element => {
    let filters = Object.values(FilterBatchStatusOptions);
    const dispatch = useAppDispatch();
    let selectedFilters = useTypedSelector((state: RootState) => state.filters.popupFilters) || [];

    let totalFilters = (!selectedFilters || selectedFilters.length === 0) ? '' : `(${selectedFilters.length})`;
    const handleToggleChange = (event: any, filterName: string) => {
        event.preventDefault();
        dispatch(filterChanged(filterName, selectedFilters.includes(filterName) ? 'remove' : 'add'));
    }
    const handleClear = (event: any) => {
        event.preventDefault();
        dispatch(filterChanged('', 'clear'));
    }

    return (
        <Popup
            trigger={<Button disabled={props.disabled} className='mmt-filters-btn' text icon={<FilterIcon />} content={`${'Filter'} ${totalFilters}`} />}
            content={
                <Flex column>
                    <Flex vAlign='center'>
                        <Text content={`${'Type'}`} weight='bold' />
                        <FlexItem push>
                            <Button className='mmt-filtersClear-btn' as={Text} text primary content={`${'Clear'}`}
                                onClick={(event) => handleClear(event)} />
                        </FlexItem>
                    </Flex>
                    <Divider />
                    {filters.map((x, i) =>
                        <Checkbox
                            key={`filters-checkBox-${i}`}
                            labelPosition="start"
                            label={x}
                            checked={selectedFilters.includes(x)}
                            onChange={(event, ctrl) => handleToggleChange(event, x)} />
                    )}
                </Flex>
            }
        />
    );
}

export default Filters;