import { useTranslation } from 'react-i18next';

import { Flex, Header, Loader } from '@fluentui/react-northstar';

import { IUserModel } from '../../../common/types/user';
import AccordionList, {
    ITableSchema
} from '../../../components/layouts/accordionList/AccordionList';
import {
    headerDepartment, headerJobTitle
} from '../../../components/layouts/accordionList/fieldColumns';
import {
    headerItemActions
} from '../../../components/layouts/accordionList/fieldColumns/ItemActionsColumn';
import {
    headerManager1, headerManager2, headerUser
} from '../../../components/layouts/accordionList/fieldColumns/UserColumn';
import { useGetAllUsersQuery } from '../../../features/user/userService';

const BrowseUsers = (): JSX.Element => {
   const { t } = useTranslation();

   const { data, error, isLoading, isFetching, refetch } = useGetAllUsersQuery();
   let items: IUserModel[] = data || [];
   items = items.map(x => ({
      ...x,
      _actions: ["ViewUser", "EditUser", "DeleteUser"],
      _footerActions: ["ViewUser", "EditUser"]
   }));
   
   const renderListSchema = (): ITableSchema[] => {
      const defaultKRAsHeader: ITableSchema[] = [
         headerUser,
         headerJobTitle,
         headerDepartment,
         headerManager1,
         headerManager2,
         headerItemActions
      ];
      return defaultKRAsHeader;
   }

   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            {items.length === 0 ? (
               <Flex fill hAlign="center" className='mmt-rowGutter'><Header as="h4" content={t('noUsers')} /></Flex>
            ) : 
               <AccordionList schema={renderListSchema()} items={items} />
            }
         </>
      )}
      </>
   );
}

export default BrowseUsers;