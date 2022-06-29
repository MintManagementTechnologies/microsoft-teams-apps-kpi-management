import * as React from 'react';

import { tableCellBehavior } from '@fluentui/accessibility';
import { TableCell } from '@fluentui/react-northstar';

import StatusPill from '../../../common/zOld/statusPills/StatusPill';
import { IHeader } from '../Header';

export const headerStatus: IHeader = {
   headerDisplayName: 'Status',
   fieldInternalName: 'status',
   maxWidth: '200px',
};

interface IStatusColumnProps {
   id: string;
   totalLevels: number;
   currentLevel: number;
   status: string;
   outcome: string;
}

const StatusColumn = (props: IStatusColumnProps): JSX.Element => {
   const { id, totalLevels, currentLevel, status, outcome } = props;

   return (
      <TableCell
         className={`mmt-tableCell-content mmt-cell-${headerStatus.fieldInternalName}`}
         key={`col-${headerStatus.fieldInternalName}-${id}`}
         content={<StatusPill id={id} totalLevels={totalLevels} currentLevel={currentLevel} status={status} outcome={outcome} />}
         truncateContent
         styles={{
            maxWidth: headerStatus.maxWidth,
            //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
         }}
         accessibility={tableCellBehavior}
      />
   );
}

export default StatusColumn;