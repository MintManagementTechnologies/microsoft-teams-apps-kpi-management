import * as React from 'react';

import { TableRow } from '@fluentui/react-northstar';

import { IAppraisalModel } from '../../../common/types/appraisal';
import { IUserModel } from '../../../common/types/user';
import { IGoalModel } from '../../../features/goalsOld/types';
import { headerDepartment, headerJobTitle } from './fieldColumns';
import ActiveColumn from './fieldColumns/ActiveColumn';
import ApproversColumn from './fieldColumns/ApproversColumn';
import CreatedColumn from './fieldColumns/CreatedColumn';
import DefaultColumn, { headerBlank, headerDefault } from './fieldColumns/DefaultColumn';
import DescriptionColumn from './fieldColumns/DescriptionColumn';
import ItemActionsColumn from './fieldColumns/ItemActionsColumn';
import PriorityColumn from './fieldColumns/PriorityColumn';
import ReviewColumn, { headerSelf } from './fieldColumns/ReviewColumn';
import StatusColumn from './fieldColumns/StatusColumn';
import TitleColumn from './fieldColumns/TitleColumn';
import UserColumn from './fieldColumns/UserColumn';
import WeightColumn from './fieldColumns/WeightColumn';

export interface IRowSchema {
   maxWidth?: string;
   fieldInternalName: string;
   fieldType?: string;
}

const Row = (props: {
   schema?: IRowSchema[],
   item: IGoalModel | IUserModel | IAppraisalModel,
   selected?: boolean,
}): JSX.Element => {
   const { selected } = props;
   const schema: IRowSchema[] = props.schema || [headerDefault];
   const currentApproversUPN = ['abrie@ajacsrsa1.onmicrosoft.com', 'jessica@ajacsrsa1.onmicrosoft.com']
   const item = props.item as any;

   const renderCellsFromSchema = (_schema: IRowSchema[] = schema) => {
      let UIitems: Array<JSX.Element> = [];
      if (_schema.length === 0)
         return UIitems;
      UIitems = _schema.map((x, i) => {
         switch (x.fieldInternalName) {
            case 'title':
               return <TitleColumn id={item.id} title={item.title} key={`k-${i}-${x.fieldInternalName}`} />
            case 'status':
               let _totalLevels = item.batchTotalLevels || item.totalLevels;
               let _currentLevel = item.batchCurrentLevel || item.currentLevel;
               let _outcome = item.batchStatus || item.status;
               return <StatusColumn id={item.id} totalLevels={_totalLevels} currentLevel={_currentLevel} status={item.status} outcome={_outcome} key={`k-${i}-${x.fieldInternalName}`} />
            case 'currentApproversUPN':
               return <ApproversColumn id={item.id} approversUPN={(item as IUserModel).managers.map(z => z.upn)} key={`k-${i}-${x.fieldInternalName}`} />
            case 'priority':
               return <PriorityColumn id={item.id} priority={item.priority} key={`k-${i}-${x.fieldInternalName}`} />
            case 'weight':
               return <WeightColumn id={item.id} weight={item.weight} key={`k-${i}-${x.fieldInternalName}`} />
            case 'createdTimestamp':
               return <CreatedColumn id={item.id} timestamp={item.createdTimestamp!} key={`k-${i}-${x.fieldInternalName}`} />
            case 'contextActions':
               return <ItemActionsColumn item={item} key={`k-${i}-${x.fieldInternalName}`} />
            case 'userUPN':
               return <UserColumn id={item.id} user={item} size={"small"} key={`k-${i}-${x.fieldInternalName}`} />
            case 'manager-1':
               return <UserColumn id={item.id} user={item.managers[0]} key={`k-${i}-${x.fieldInternalName}`} />
            case 'manager-2':
               return <UserColumn id={item.id} user={item.managers[1]} key={`k-${i}-${x.fieldInternalName}`} />
            case 'currentApproverUPN':
               return <ApproversColumn id={item.id} approversUPN={(item as IAppraisalModel).allApproversUPN} key={`k-${i}-${x.fieldInternalName}`} />
            case 'appraisalYear':
               let tmpAppraisalYear = new Date(item.createdTimestamp).getFullYear();
               return <TitleColumn id={item.id} title={tmpAppraisalYear.toString()} key={`k-${i}-${x.fieldInternalName}`} />
            case 'periodGroupByYear':
               return <TitleColumn id={item.id} title={item.periodGroupByYear} key={`k-${i}-${x.fieldInternalName}`} />
            case 'resultSelf':
            case 'result1':
            case 'result2':
            case 'overallResult':
               return <ReviewColumn id={item.id} header={headerSelf} key={`k-${i}-${x.fieldInternalName}`} content={item.overallResult} />
            case 'description':
               return <DescriptionColumn id={item.id} content={item.description} key={`k-${i}-${x.fieldInternalName}`} />
            case 'jobTitle':
               return <DefaultColumn id={item.id} header={headerJobTitle} content={(item as IUserModel).jobTitle} key={`k-${i}-${x.fieldInternalName}`} />
            case 'department':
               return <DefaultColumn id={item.id} header={headerDepartment} content={(item as any).departmentTitle} key={`k-${i}-${x.fieldInternalName}`} />
            case 'active':
               return <ActiveColumn id={item.id} content={item.active ? 'active' : 'inactive'} key={`k-${i}-${x.fieldInternalName}`} />
            case 'blank':
               return <DefaultColumn id={item.id} header={headerBlank} content={``} key={`k-${i}-${x.fieldInternalName}`} />
            default:
               return <DefaultColumn id={item.id} header={headerDefault} content={`Row Error: ${x.fieldInternalName}`} key={`k-${i}-${x.fieldInternalName}`} />
         }
      })
      return UIitems as any[];
   }

   return (
      <TableRow
         key={`tableRow-${item.id}`}
         selected={selected}
         className={selected ? `mmt-row-selected mmt-tableRow tableRow-${item.id}` : `mmt-tableRow tableRow-${item.id}`}
      >
         {renderCellsFromSchema(schema).map((x: any, i: number) => x)}
         {/* <TableCell
                key={`col-select-${item.id}`}
                content={<Checkbox defaultChecked={selected} />}
                truncateContent
                styles={{
                    maxWidth: '40px',
                    //paddingRight: props.fieldType === 'rowSelector' ? '0px' : '',
                }}
                accessibility={tableCellBehavior}
            /> */}



         {/*          
         <DefaultColumn id={item.id} header={headerDepartment} content={''} />
         <DefaultColumn id={item.id} header={headerDepartment} content={''} />
         <DefaultColumn id={item.id} header={headerDepartment} content={''} />
         <DefaultColumn id={item.id} header={headerDepartment} content={''} />
         <CreatedColumn id={item.id} timestamp={item.createdTimestamp!} />
         <ItemActionsColumn item={item} />


         <TitleColumn id={item.id} title={item.title} />
         <StatusColumn id={item.id} totalLevels={item.batchTotalLevels} currentLevel={item.batchCurrentLevel} status={item.status} outcome={item.batchStatus} />
          */}

      </TableRow>
   );
}

export default Row;