import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerTitle:IHeader = {
    headerDisplayName: 'Key Result Area',
    maxWidth: '300px',
    fieldInternalName: 'title',
};

const TitleColumn = (props: { id: string, title: string }): JSX.Element => {
    const { id, title } = props;

    return (
        <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerTitle.fieldInternalName}`}
            key={`col-${headerTitle.fieldInternalName}-${id}`}
            content={<Text content={title} size="medium" />}
            truncateContent
            styles={{
                maxWidth: headerTitle.maxWidth,
                //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
            }}
        />
    );
}

export default TitleColumn;