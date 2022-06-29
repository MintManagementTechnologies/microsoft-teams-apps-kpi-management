
import { useTranslation } from 'react-i18next';

import { Button, Divider, Flex, Loader, Text } from '@fluentui/react-northstar';

import { getLocaleDate } from '../../../common/utils/sharedFunctions';
import { IGoalModel } from '../../../features/goalsOld/types';

const GoalCardBody = (props: {
   item: IGoalModel
}): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { item } = props;
   const createdTxt = getLocaleDate(item.createdTimestamp);
   return (
      <>
         <Flex column gap="gap.medium" fill>
            <Flex column gap="gap.large" fill>
               <Flex space="between" fill>
                  <Text content={t(`Pending Submission`)} className="mmt-status" />
                  <Flex gap="gap.small">
                     <Text content={t(`label-priority`)} className="mmt-priority" />
                     <Text content={t(`${item.priority}`)} className="mmt-priority-value" />
                  </Flex>
               </Flex>
               <Flex space="between" className="mmt-details" gap="gap.small" vAlign="center" fill>
                  <Flex column>
                     <Text content={t(`label-weight`)} className="mmt-label" />
                     <Text content={t(`${item.weight}%`)} className="mmt-value" />
                  </Flex>
                  <Divider className="mmt-divider" vertical size={1} />
                  <Flex column>
                     <Text content={t(`label-timing`)} className="mmt-label" />
                     <Text content={t(`value-timing-${item.timing}`)} className="mmt-value" />
                  </Flex>
               </Flex>
               <Text content={createdTxt} size="small" className="mmt-timestamp" />
            </Flex>
         </Flex>
      </>
   );
}

export default GoalCardBody;
