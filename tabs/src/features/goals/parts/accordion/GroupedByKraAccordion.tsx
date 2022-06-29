import './Accordion.scss';

import { useSelector } from 'react-redux';

import { Accordion, Flex } from '@fluentui/react-northstar';

import GoalList from '../../GoalList';
import { makeSelectUserGoalsByKra, selectGoalsByKra } from '../../goalSelectors';
import GoalKraRow from '../rowLayouts/GoalKraRow';

const GroupedByKraAccordion = (props: { userId?: number }): JSX.Element => {
   const userId = props.userId || 0;
   const userGoalsByKraSelector = makeSelectUserGoalsByKra(userId);
   //@ts-ignore
   const selectedGroupedByKra = useSelector(userGoalsByKraSelector);

   const panels = selectedGroupedByKra.map(x => {
      return {
         // key: `${x.key}-rrr-${x.id}`,
         id: x.id,
         title: <GoalKraRow content={`${x.title} (${x.groupByTotal})`} key={`${x.key}-title`} />,
         content: <GoalList items={x.items} layout={`flatTable`} key={`${x.key}-content`} />
      }
   });

   return (
      <Flex fill gap="gap.small" column>
         <Accordion className={`mmt-sectionAccordion mmt-totalSubLevels-1`} defaultActiveIndex={0} panels={panels} exclusive expanded />
      </Flex>
   );
}

export default GroupedByKraAccordion;