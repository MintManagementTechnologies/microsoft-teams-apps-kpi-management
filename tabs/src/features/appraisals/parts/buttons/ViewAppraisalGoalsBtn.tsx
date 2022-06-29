import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { EyeFriendlierIcon } from '@fluentui/react-northstar';

import LinkButton from '../../../../components/common/buttons/LinkButton';

const ViewAppraisalGoalsBtn = (props: { id: string | number, userId: string | number }): JSX.Element => {
   const { id, userId } = props;
   const { t } = useTranslation();
   const { userScope } = useParams<{ userScope: string }>();

   return (
      <LinkButton
         path={`${userScope}/myappraisals/batch/${id}/user/${userId}`}
         content={`${t(`button.goal.batch`)}`}
         icon={<EyeFriendlierIcon />}
         text
      />
   );
}

export default ViewAppraisalGoalsBtn;