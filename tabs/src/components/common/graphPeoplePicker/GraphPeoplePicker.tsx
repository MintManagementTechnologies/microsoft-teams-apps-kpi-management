import './GraphPeoplePicker.scss';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { IBasicUserModel, IUserModel } from '../../../common/types/user';
import { defaultAvatar } from '../../../common/utils/commonVariables';
import { log } from '../../../common/utils/customConsoleLog';
import { useSearchUsersQuery } from '../../../services/graphApiService';

const GraphPeoplePicker = (props: {
   fieldId: string,
   multiple?: boolean,
   defaultSelected?: IBasicUserModel | IBasicUserModel[],
   onChange: (selected: IUserModel | IUserModel[], _extraOptions?: any) => void
}): JSX.Element => {
   const { t, i18n } = useTranslation();
   const { fieldId, multiple, defaultSelected } = props;
   const defaultSelectedType = Array.isArray(defaultSelected) ? 'array' : typeof defaultSelected;

   let tmpDefaultValue;
   let tmpSearchQuery = '';
   switch (defaultSelectedType) {
      case "object":
         tmpDefaultValue = {
            header: (defaultSelected as IBasicUserModel).title,
            image: (defaultSelected as IBasicUserModel).image || defaultAvatar,
            content: (defaultSelected as IBasicUserModel).upn,
            key: (defaultSelected as IBasicUserModel).id,
            selected: true,
            active: true,
         }
         tmpSearchQuery = tmpDefaultValue.header;
         break;
      case "array":
         tmpDefaultValue = (defaultSelected as IBasicUserModel[]).map(x => ({
            header: x.title,
            image: x.image || defaultAvatar,
            content: x.upn,
            key: x.id
         }));
         break;
      default:
         break;
   }

   const defaultValue = tmpDefaultValue;

   const [searchQuery, setSearchQuery] = useState(tmpSearchQuery);
   const { data, isFetching } = useSearchUsersQuery(searchQuery || skipToken);

   // useEffect(() => {
   //    if (data && !graphLoading) {
   //       setUserOptions(data.map(x => ({
   //          header: x.title,
   //          image: x.image || defaultAvatar, //'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CameronEvans.jpg',
   //          content: x.upn,
   //          key: x.id,
   //       })));
   //    }
   // }, [data, graphLoading]);

   useEffect(() => {
      log('START----useEffect----', 'warning');
      if (defaultSelected && !Array.isArray(defaultSelected)) {
         setSearchQuery((defaultSelected as any).title);
         log('END----useEffect----', 'warning');
      }
   }, [defaultSelected]);

   // useEffect(() => {
   //    if (searchQuery) {
   //       refetch()
   //    }
   // }, [searchQuery]);

   const mapValueToSingleUser = (value: any) => {
      if (!value) return;
      let userProperties = data!.find(y => y.id === value.key);
      return userProperties;
   }

   const mapValueToMultipleUsers = (value: any) => {
      let tmpSelectedUsers = value ?
         value.map((x: any) => {
            let userProperties = data!.find(y => y.id === x.key);
            return userProperties;
         })
         : [];
      return tmpSelectedUsers;
   }

   const handleOnChange = (event: any, value: any) => {
      if (event !== null) event.preventDefault();
      let tmpSelectedUsers = multiple ? mapValueToMultipleUsers(value) : mapValueToSingleUser(value);
      props.onChange(tmpSelectedUsers, fieldId);
   }

   const handleOnSearchQuery = (searchText: string) => {
      if (searchText.length > 1) {
         //@ts-ignore
         setSearchQuery(searchText || '');
      }
      //setSearchQuery(searchText || '');
   }


   if (fieldId === 'manager-1') {
      log('START----lm1----', 'test');
      log('defaultValue');
      log(defaultValue);
      console.log(searchQuery);
      log('END----lm1----', 'test');
   }

   if (fieldId === 'manager-2') {
      log('START----lm2----', 'test');
      log('defaultValue');
      log(defaultValue);
      console.log(searchQuery);
      log('END----lm2----', 'test');
   }

   // @ts-ignore
   let dropdownOptions: dropdownOption[] = [];
   if (data && data?.length > 0) {
      dropdownOptions = data?.map(x => ({
         header: x.title,
         image: x.image || defaultAvatar, //'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/CameronEvans.jpg',
         content: x.upn,
         key: x.id,
      }));
   }

   return (
      <Dropdown
         className="mmt-graphPeoplePicker"
         fluid
         loading={isFetching}
         loadingMessage={`Loading users...`}
         multiple={multiple}
         search
         defaultValue={defaultValue}
         defaultSearchQuery={searchQuery}
         items={dropdownOptions}
         placeholder={t('form.searchUser.placeholder')}
         noResultsMessage={`No users found.`}
         onSearchQueryChange={(event, { searchQuery }) => { handleOnSearchQuery(searchQuery || '') }}
         onChange={(event, { value }) => handleOnChange(event, value)}
      />
   );
}

export default GraphPeoplePicker;