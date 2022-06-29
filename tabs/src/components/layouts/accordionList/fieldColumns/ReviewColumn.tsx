import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerSelf:IHeader = {
    headerDisplayName: 'Self Review',
    maxWidth: '150px',
    fieldInternalName: 'resultSelf',
};

export const headerReview1:IHeader = {
   headerDisplayName: '1st Level Review',
   maxWidth: '150px',
   fieldInternalName: 'result1',
};

export const headerReview2:IHeader = {
   headerDisplayName: '2nd Level Review',
   maxWidth: '150px',
   fieldInternalName: 'result2',
};

export const headerReviewOverall:IHeader = {
   headerDisplayName: 'Score',
   maxWidth: '150px',
   fieldInternalName: 'overallResult',
};

const ReviewColumn = (props: { id: string, header: IHeader, content: string}): JSX.Element => {
    const { id, header, content } = props;

    return (
        <TableCell
        className={`mmt-tableCell-content mmt-cell-${header.fieldInternalName}`}
        key={`col-${header.fieldInternalName}-${id}`}
            content={<Text content={`${content}%`} size="medium" />}
            truncateContent
            styles={{
                maxWidth: header.maxWidth,
                //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
            }}
        />
    );
}

export default ReviewColumn;