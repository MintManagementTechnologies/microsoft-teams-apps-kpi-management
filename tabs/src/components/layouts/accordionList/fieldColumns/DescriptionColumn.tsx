import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

const header: IHeader = {
   headerDisplayName: 'Description',
   maxWidth: '300px',
   fieldInternalName: 'description',
}

export const headerDescription: IHeader = header;

const DescriptionColumn = (props: { id: string, content: string}): JSX.Element => {
   const { id, content } = props;

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${header.fieldInternalName}`}
         key={`col-${header.fieldInternalName}-${id}`}
         content={<Text content={content} size="medium" />}
         // truncateContent
         styles={{
            maxWidth: header.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default DescriptionColumn;