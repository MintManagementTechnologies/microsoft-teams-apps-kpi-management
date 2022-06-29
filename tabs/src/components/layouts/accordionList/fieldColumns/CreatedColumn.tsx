import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import { IHeader } from '../Header';

export const headerCreated: IHeader = {
   headerDisplayName: 'Created',
   maxWidth: '150px',
   fieldInternalName: 'createdTimestamp',
};

const CreatedColumn = (props: { id: string, timestamp: number }): JSX.Element => {
   const { id, timestamp } = props;
   let dateString = getLocaleDate(timestamp, "dd/MM/yyyy hh:mm");

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerCreated.fieldInternalName}`}
         key={`col-${headerCreated.fieldInternalName}-${id}`}
         content={<Text content={dateString} size="small" />}
         truncateContent
         styles={{
            maxWidth: headerCreated.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default CreatedColumn;