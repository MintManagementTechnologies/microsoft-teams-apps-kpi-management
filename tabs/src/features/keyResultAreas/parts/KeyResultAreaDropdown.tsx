import { useTranslation } from 'react-i18next';

import { FormDropdown, FormDropdownProps, Loader as FluentLoader } from '@fluentui/react-northstar';

import Loader from '../../../components/common/Loader';
import { useGetAllKeyResultAreasQuery } from '../keyResultAreaService';
import mockData from '../mockData';
import { IKeyResultAreaModel } from '../types';

const KeyResultAreaDropdown = (props: { defaultItemId?: number | string } & FormDropdownProps): JSX.Element => {
   const { defaultItemId, ...otherProps } = props;

   const { t, i18n } = useTranslation();

   const { data: dataGetAllKeyResultAreas, isFetching: isFetchingGetAllKeyResultAreas, isLoading: isLoadingGetAllKeyResultAreas }
      = useGetAllKeyResultAreasQuery();

   const allItems: IKeyResultAreaModel[] = dataGetAllKeyResultAreas || mockData;
   const dropdownOptions = allItems.map(x => ({ key: x.id, header: x.title }));
   const defaultOption = dropdownOptions.find(x => x.header === defaultItemId || x.key === defaultItemId);
   const isLoading = isFetchingGetAllKeyResultAreas || isLoadingGetAllKeyResultAreas;
   return (
      <>
         {isLoading ?
            <Loader message={t('entity.kra', { count: 0 })} size={'smaller'} labelPosition="end" hAlign={"start"} />
            :
            <FormDropdown
               {...otherProps}
               label={t('form.kra.label')}
               placeholder={t('form.kra.placeholder')}
               fluid
               items={dropdownOptions}
               defaultValue={defaultOption}
            />
         }
      </>
   );
}

export default KeyResultAreaDropdown;