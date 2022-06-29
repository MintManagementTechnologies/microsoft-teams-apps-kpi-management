import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerWeight:IHeader = {
    headerDisplayName: 'Weight',
    maxWidth: '150px',
    fieldInternalName: 'weight',
};

const WeightColumn = (props: { id: string, weight: number }): JSX.Element => {
    const { id, weight } = props;

    return (
        <TableCell
        className={`mmt-tableCell-content mmt-cell-${headerWeight.fieldInternalName}`}
        key={`col-${headerWeight.fieldInternalName}-${id}`}
            content={<Text content={`${weight}%`} size="medium" />}
            truncateContent
            styles={{
                maxWidth: headerWeight.maxWidth,
                //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
            }}
        />
    );
}

export default WeightColumn;