import { Flex } from '@fluentui/react-northstar';

import { getLocaleDate } from '../../../../common/utils/sharedFunctions';
import Card from '../../../../components/card/Card';
import { IGoalModel } from '../../types';
import EditGoalBtn from '../buttons/EditGoalBtn';
import ItemActionsPopup from '../buttons/ItemActionsPopup';
import ViewGoalBtn from '../buttons/ViewGoalBtn';
import GoalCardBody from './GoalCardBody';

const GoalCard = (props: { item: IGoalModel, displayMode: string }): JSX.Element => {
   const { item, displayMode } = props;
   const createdTxt = getLocaleDate(item.createdTimestamp);
   const availableActions = ['view'];
   if(displayMode === 'edit'){
      availableActions.push('edit');
      availableActions.push('delete');
   }
   return (
      <Flex>
         <Card
            item={{ title: item.kraTitle, subtitle: createdTxt }}
            header={<ItemActionsPopup actions={availableActions} item={item} />}
            body={<GoalCardBody item={item} />}
            footer={<><EditGoalBtn id={item.id} tinted /><ViewGoalBtn id={item.id} tinted /></>}
         />
      </Flex>
   );
}

export default GoalCard;
