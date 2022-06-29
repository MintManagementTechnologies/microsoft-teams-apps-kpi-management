import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Button, EditIcon, Flex } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectAppraisalPeriod } from '../../appraisalPeriodSelectors';
import { useLazyGetAllAppraisalPeriodsQuery } from '../../appraisalPeriodService';

const EditAppraisalPeriodBtn = (props: { id: string | number }): JSX.Element => {
   const { id } = props;
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const selectedItemState = useSelector(selectAppraisalPeriod);
   const [trigger] = useLazyGetAllAppraisalPeriodsQuery();

   const handleCallback = async (result: any) => {
      const _dialogResult = result as { action: string, additionalInfo: any };
      if (_dialogResult && _dialogResult.additionalInfo && _dialogResult.additionalInfo.includes("callback")) {
         trigger();
      } else {
         console.log("DONT REFRESH");
      }
   }

   return (
      <TaskModuleButton
         title={`${t(`modal.hrAdmin.period.headerAction`, { action: t(`common:button.edit`) })}`}
         path={`hr/period/edit/${id}`}
         content={`${t(`common:button.edit`)}`}
         icon={<EditIcon />}
         text
         callback={handleCallback}
      />
   );
}

export default EditAppraisalPeriodBtn;