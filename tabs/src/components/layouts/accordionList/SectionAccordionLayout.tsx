import * as React from 'react';
import { Accordion, Flex, FlexItem, Table, Text } from '@fluentui/react-northstar';
import Row from './Row';
import { groupBy } from '../../../common/utils/sharedFunctions';
import GroupItemsActions from './fieldColumns/GroupItemsActions';
import { IGroupByFields } from './AccordionList';
import AccordionTitle from './AccordionTitle';

import './AccordionList.scss';

const SectionAccordionLayout = (props: { items: any[], groupByFields: IGroupByFields[] }): JSX.Element => {
   const { items, groupByFields } = props;
   const totalGroupByFields = groupByFields.length;
   const tmpGroupByFields = [...groupByFields];
   const groupByField = tmpGroupByFields.pop();

   const groupByResult = groupBy(items, groupByField?.id!);

   let tmpPanels = [];
   for (const [key, value] of Object.entries(groupByResult)) {
      let groupByHeader = (value as any[]) ? (value as any[])[0][groupByField?.headerProp!] : key;
      let groupById = key;

      if (!groupByHeader) {
         console.log('groupByHeader');
         console.log(groupByHeader);
      }
   
      let panel = {
         key: key,
         title: <AccordionTitle key={`accordionTitle-${groupById}`} item={groupByHeader} schema={groupByField?.schema?.header} id={groupById} />,
         content: totalGroupByFields === 1 ?
            <Table key={`itemTable-${key}`} className={`mmt-list-table`}>
               {(value as any[]).map(x =>
                  <Row
                     key={`itemRow-${x.id}`}
                     item={x}
                     schema={groupByField?.schema?.content}
                  />
               )}
            </Table>
            : 
            <SectionAccordionLayout
               key={`sectionRow-${key}`}
               items={(value as any[])}
               groupByFields={tmpGroupByFields}
            />
      }
      tmpPanels.push(panel);
   }

   return (
      <>
         <Accordion key={`accordion-${totalGroupByFields}`} className={`mmt-sectionAccordion mmt-section-node-${totalGroupByFields}`} panels={tmpPanels} exclusive defaultActiveIndex={0} />
      </>
   );
}

export default SectionAccordionLayout;