import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerPriority: IHeader = {
   headerDisplayName: 'Priority',
   maxWidth: '150px',
   fieldInternalName: 'priority',
};

const PriorityColumn = (props: { id: string, priority: number }): JSX.Element => {
   const { id, priority } = props;

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerPriority.fieldInternalName}`}
         key={`col-${headerPriority.fieldInternalName}-${id}`}
         content={<Text content={priority} size="medium" />}
         truncateContent
         styles={{
            maxWidth: headerPriority.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default PriorityColumn;