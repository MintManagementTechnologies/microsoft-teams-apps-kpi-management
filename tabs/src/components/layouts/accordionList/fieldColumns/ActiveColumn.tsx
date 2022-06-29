import * as React from 'react';
import { TableCell, Text } from '@fluentui/react-northstar';
import { IHeader } from '../Header';
import { useTranslation } from 'react-i18next';

const header: IHeader = {
   headerDisplayName: 'Status',
   maxWidth: '150px',
   fieldInternalName: 'active',
}

export const headerActive: IHeader = header;

const ActiveColumn = (props: { id: string, content: string}): JSX.Element => {
   const { t } = useTranslation();
   const { id, content } = props;

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${header.fieldInternalName}`}
         key={`col-${header.fieldInternalName}-${id}`}
         content={<Text content={t(`fields.active.value.${content}`)} size="large" weight="bold" color='green' />}
         // truncateContent
         styles={{
            maxWidth: header.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
      />
   );
}

export default ActiveColumn;