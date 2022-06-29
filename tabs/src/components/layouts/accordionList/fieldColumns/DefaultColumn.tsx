import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';

export const headerDefault: IHeader = {
   headerDisplayName: 'Title',
   maxWidth: '100%',
   fieldInternalName: 'title',
}
export const headerBlank: IHeader = {
   headerDisplayName: '',
   maxWidth: '150px',
   fieldInternalName: 'blank',
}

const DefaultColumn = (props: { id: string, header: IHeader, content: string}): JSX.Element => {
   const { id, header, content } = props;

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${header.fieldInternalName}`}
         key={`col-${header.fieldInternalName}-${id}`}
         content={<Text content={content} size="medium" />}
         truncateContent
         styles={{
            maxWidth: header.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default DefaultColumn;