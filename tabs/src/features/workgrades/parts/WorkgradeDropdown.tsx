import { useTranslation } from 'react-i18next';

import { FormDropdown, FormDropdownProps } from '@fluentui/react-northstar';

import Loader from '../../../components/common/Loader';
import mockData from '../mockData';
import { IWorkgradeModel } from '../types';
import { useGetAllWorkgradesQuery } from '../workgradeService';

const WorkgradeDropdown = (props: { defaultItemId?: number | string } & FormDropdownProps): JSX.Element => {
   const { defaultItemId, ...otherProps } = props;

   const { t, i18n } = useTranslation();

   const { data: dataGetAllWorkgrades, isFetching: isFetchingGetAllWorkgrades, isLoading: isLoadingGetAllWorkgrades }
      = useGetAllWorkgradesQuery();

   const allItems: IWorkgradeModel[] = dataGetAllWorkgrades || mockData;
   const dropdownOptions = allItems.map(x => ({ key: x.id, header: x.title }));
   const defaultOption = dropdownOptions.find(x => x.key === defaultItemId);
   const isLoading = isFetchingGetAllWorkgrades || isLoadingGetAllWorkgrades;
   return (
      <>
         {isLoading ?
            <Loader message={t('entity.workgrade', { count: 0 })} size={'smaller'} labelPosition="end" hAlign={"start"} />
            :
            <FormDropdown
               label={t('form.workgrade.label')}
               {...otherProps}
               placeholder={t('form.workgrade.placeholder')}
               fluid
               items={dropdownOptions}
               defaultValue={defaultOption}
            />
         }
      </>
   );
}

export default WorkgradeDropdown;