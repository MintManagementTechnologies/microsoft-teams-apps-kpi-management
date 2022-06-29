import './Accordion.scss';

import { useSelector } from 'react-redux';

import { Accordion, Flex } from '@fluentui/react-northstar';

import GoalList from '../../GoalList';
import { selectGoalsByUser } from '../../goalSelectors';
import GoalUserRow from '../rowLayouts/GoalUserRow';

const GroupedByUserAccordion = (): JSX.Element => {
   const selectedGroupedByUser = useSelector(selectGoalsByUser);

   const panels = selectedGroupedByUser.map(x => {
      return {
         // key: `${x.key}-rrr-${x.id}`,
         id: x.id,
         title: <GoalUserRow content={`${x.title}`} key={`${x.key}-title`} items={x.items} />,
         content: <GoalList items={x.items} layout={`groupedByKraAccordion`} key={`${x.key}-content`} userId={x.id} />
      }
   });
   
   return (
      <Flex fill gap="gap.small" column>
         <Accordion className={`mmt-sectionAccordion mmt-totalSubLevels-2`} defaultActiveIndex={0} panels={panels} exclusive expanded />
      </Flex>
   );
}

export default GroupedByUserAccordion;