import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { EyeFriendlierIcon } from '@fluentui/react-northstar';

import LinkButton from '../../../../components/common/buttons/LinkButton';
import { RootState, useAppDispatch, useTypedSelector } from '../../../../store';
import { itemChanged } from '../../goalBatchSlice';

const ViewGoalBatchBtn = (props: { id: string | number, userId: string | number }): JSX.Element => {
   const { id, userId } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();
   const { userScope } = useParams<{ userScope: string }>();


   return (
      <LinkButton
         path={`${userScope}/mygoals/batch/${id}/user/${userId}`}
         content={`${t(`button.goal.batch`)}`}
         icon={<EyeFriendlierIcon />}
         text
         // onClick={handleOnClick}
      />
   );
}

export default ViewGoalBatchBtn;