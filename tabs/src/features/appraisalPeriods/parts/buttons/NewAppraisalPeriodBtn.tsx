
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { AddIcon, Flex } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import TaskModuleButton from '../../../../components/common/buttons/TaskModuleButton';
import { useAppDispatch } from '../../../../store';
import { selectAppraisalPeriod } from '../../appraisalPeriodSelectors';
import { useLazyGetAllAppraisalPeriodsQuery } from '../../appraisalPeriodService';

const NewAppraisalPeriodBtn = (): JSX.Element => {
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
   
   const id = uuid();
   const entity = 'appraisalPeriod';
   return (
      <Flex>
         <TaskModuleButton
            title={`${t(`modal.hrAdmin.period.headerAction`, { action: t(`common:button.create`) })}`}
            path={`hr/period/new/${id}`}
            content={`${t(`common:button.newEntity`, { entity: t(`entity.${entity}`, { count: 1 }) })}`}
            icon={<AddIcon />}
            primary
            callback={handleCallback}
         />
      </Flex>
   );
}

export default NewAppraisalPeriodBtn;