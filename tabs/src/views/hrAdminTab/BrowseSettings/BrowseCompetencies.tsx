import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Flex, Text } from '@fluentui/react-northstar';

import CompetencyList from '../../../features/competencies/CompetencyList';
import { selectCompetencyList } from '../../../features/competencies/competencySelectors';
import NewCompetencyBtn from '../../../features/competencies/parts/buttons/NewCompetencyBtn';
import WorkgradeDropdown from '../../../features/workgrades/parts/WorkgradeDropdown';
import { itemIdChanged } from '../../../features/workgrades/workgradeSlice';
import { useAppDispatch } from '../../../store';

const BrowseCompetencies = (): JSX.Element => {
   const { t } = useTranslation();
   const dispatch = useAppDispatch();

   const items = useSelector(selectCompetencyList);

   const handleOnChange = (event: any, value: string) => {
      dispatch(itemIdChanged(value));
   }

   return (
      <>
         <Flex gap="gap.medium">
            <NewCompetencyBtn />
            <Flex gap="gap.smaller" vAlign="center" fill>
               <Text content={`${t('form.workgrade.label')}:`} weight="semibold"/>
               <WorkgradeDropdown
                  label={undefined}
                  onChange={
                     (event, { value }: { value?: any }) =>
                        handleOnChange(event, value ? value.key : 0)
                  }
                  styles={{
                     minWidth: '300px'
                  }}
               />
            </Flex>
         </Flex>
         <CompetencyList items={items} />
      </>
   );
}

export default BrowseCompetencies;