import './Accordion.scss';

import { useSelector } from 'react-redux';

import { Accordion, Flex } from '@fluentui/react-northstar';

import AppraisalPeriodList from '../../AppraisalPeriodList';
import { selectAppraisalPeriodsByYear } from '../../appraisalPeriodSelectors';
import AppraisalPeriodYearRow from '../rowLayouts/AppraisalPeriodYearRow';

const GroupedByYearAccordion = (): JSX.Element => {
   const selectedGroupedByYear = useSelector(selectAppraisalPeriodsByYear);

   const panels = selectedGroupedByYear.map(x => {
      return {
         // key: `${x.key}-rrr-${x.id}`,
         id: x.id,
         title: <AppraisalPeriodYearRow content={`${x.title} (${x.groupByTotal})`} key={`${x.key}-title`}/>,
         content: <AppraisalPeriodList items={x.items} layout={`flatTable`} key={`${x.key}-content`}/>
      }
   });
   
   return (
      <Flex fill gap="gap.small" column>
         <Accordion className={`mmt-sectionAccordion mmt-totalSubLevels-1`} defaultActiveIndex={0} panels={panels} exclusive expanded />
      </Flex>
   );
}

export default GroupedByYearAccordion;