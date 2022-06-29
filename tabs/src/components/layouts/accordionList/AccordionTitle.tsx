import * as React from 'react';

import { TableRow } from '@fluentui/react-northstar';

import { IAppraisalModel } from '../../../common/types/appraisal';
import { IUserModel } from '../../../common/types/user';
import { IGoalModel } from '../../../features/goalsOld/types';
import { headerDepartment, headerJobTitle } from './fieldColumns';
import ApproversColumn from './fieldColumns/ApproversColumn';
import CreatedColumn from './fieldColumns/CreatedColumn';
import DefaultColumn, { headerBlank, headerDefault } from './fieldColumns/DefaultColumn';
import ItemActionsColumn from './fieldColumns/ItemActionsColumn';
import PriorityColumn from './fieldColumns/PriorityColumn';
import ReviewColumn, { headerSelf } from './fieldColumns/ReviewColumn';
import StatusColumn from './fieldColumns/StatusColumn';
import TitleColumn, { headerTitle } from './fieldColumns/TitleColumn';
import UserColumn from './fieldColumns/UserColumn';
import WeightColumn from './fieldColumns/WeightColumn';
import { IHeader } from './Header';
import { IRowSchema } from './Row';

const AccordionTitle = (props: {
   id: string,
   schema?: IRowSchema[],
   item: any,
   selected?: boolean,
}): JSX.Element => {
   const { id, item, selected } = props;
   const schema: IRowSchema[] = props.schema || [headerDefault];
   if (!item) {
      console.log('item');
      console.log(item);
   }
   const currentApproversUPN = ['abrie@ajacsrsa1.onmicrosoft.com', 'jessica@ajacsrsa1.onmicrosoft.com']

   const renderCellsFromSchema = (_schema: IRowSchema[] = schema) => {
      let UIitems: Array<JSX.Element> = [];
      if (_schema.length === 0)
         return UIitems;
      UIitems = _schema.map((x,i) => {
         switch (x.fieldInternalName) {
            case 'title':
               return <TitleColumn id={item.id} title={item.title} key={`k-${i}-${x.fieldInternalName}`} />
            case 'status':
               let _totalLevels = item.batchTotalLevels || item.totalLevels;
               let _currentLevel = item.batchCurrentLevel || item.currentLevel;
               let _outcome = item.batchStatus || item.status;
               return <StatusColumn id={item.id} totalLevels={_totalLevels} currentLevel={_currentLevel} status={item.status} outcome={_outcome} key={`k-${i}-${x.fieldInternalName}`} />
            case 'currentApproversUPN':
               return <ApproversColumn id={item.id} approversUPN={currentApproversUPN} key={`k-${i}-${x.fieldInternalName}`} />
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
               let tmpAppraisalYear = item; //new Date(item).getFullYear();
               return <TitleColumn id={item} title={tmpAppraisalYear.toString()} key={`k-${i}-${x.fieldInternalName}`} />
            case 'resultSelf':
            case 'result1':
            case 'result2':
            case 'overallResult':
               return <ReviewColumn id={item.id} header={headerSelf} key={`k-${i}-${x.fieldInternalName}`} content={item.overallResult} />
            case 'blank':
               return <DefaultColumn id={item.id} header={headerBlank} content={``} key={`k-${i}-${x.fieldInternalName}`} />
            default:
               return <DefaultColumn id={item.id} header={headerDefault} content={`AccordionTitle Error: ${x.fieldInternalName}`} key={`k-${i}-${x.fieldInternalName}`} />
         }
      })
      return UIitems as any[];
   }


   if(typeof item === 'string'){
      return (
         <TableRow compact
            selected={selected}
            className={`mmt-accordionTitle-row accordionTitle-row-${id} ${selected ? 'mmt-accordionTitle-row-selected' : ''}`}
         >
            <DefaultColumn id={id} header={headerTitle} content={item} />
         </TableRow>
      );

   }
   if (!item) {
      return <></>
   }

   return (
      <TableRow compact
         selected={selected}
         className={`mmt-accordionTitle-row accordionTitle-row-${item.id} ${selected ? 'mmt-accordionTitle-row-selected' : ''}`}
      >
         {renderCellsFromSchema(schema).map((x: any, i: number) => x)}
         {/* <UserColumn id={item.id} user={item} size={"small"} />
         <StatusColumn id={item.id} totalLevels={item.batchTotalLevels} currentLevel={item.batchCurrentLevel} status={item.status} outcome={item.batchStatus} />
         <DefaultColumn id={item.id} header={headerJobTitle} content={''} />
         <DefaultColumn id={item.id} header={headerDepartment} content={''} />
         <UserColumn id={item.id} user={item.managers[0]} />
         <UserColumn id={item.id} user={item.managers[1]} />
         <ItemActionsColumn item={item} /> */}
      </TableRow>
   );
}

export default AccordionTitle;