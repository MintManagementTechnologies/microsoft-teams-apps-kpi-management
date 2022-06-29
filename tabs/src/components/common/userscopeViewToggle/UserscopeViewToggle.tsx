import './UserscopeViewToggle.scss';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Dropdown, Flex } from '@fluentui/react-northstar';

import { getRouteParams } from '../../../common/utils/sharedFunctions';

const UserscopeViewToggle = (props: {isDisabled?: boolean}): JSX.Element => {
   const { isDisabled } = props;
   const navigate = useNavigate();
   const { t } = useTranslation();
   const { userScope } = useParams();
   const { view } = getRouteParams(window.location.hash);
   const { pathname } = useLocation();
   let [searchParams, setSearchParams] = useSearchParams();

   const handleOnChange = (event: any, value: any) => {
      if (event !== null) event.preventDefault();
      let layout = searchParams.get("layout");
      const replacedUserScope = value.key === 'me' ? pathname.replace('team', value.key) : pathname.replace('me', value.key);
      const path = `${replacedUserScope}?layout=${layout}`
      navigate(path);
   }

   const dashboardOptions = [
      { header: t(`tab.${view}.header.me`), key: `me` },
      { header: t(`tab.${view}.header.team`), key: `team` },
   ];
   let index = 0;
   if (userScope === 'team') index = 1;
   const defaultValue = dashboardOptions[index];
   const styles = {
      color: 'green',
    }
   return (
      <Flex>
         <Dropdown
            variables={{
               color: 'rgb(238, 60, 46)',
            }}
            inverted
            fluid
            className="mmt-viewToggle-userscope"
            defaultValue={defaultValue}
            items={dashboardOptions}
            onChange={(event, { value }) => handleOnChange(event, value)}
            disabled={isDisabled}
         />
      </Flex>
   );

   // return (
   //    <CommandsSplitButton commands={cmds} menuButtonClickCallback={onMenuButtonClick} index={index} />
   // );
}

export default UserscopeViewToggle;