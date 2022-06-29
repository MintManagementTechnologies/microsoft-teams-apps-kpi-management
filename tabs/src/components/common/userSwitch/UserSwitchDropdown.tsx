import './UserSwitchDropdown.scss';

import { useTranslation } from 'react-i18next';

import {
    Button, Dropdown, DropdownProps, Flex, FormDropdown, Loader as FluentLoader
} from '@fluentui/react-northstar';
import { ErrorCode, ErrorWithCode, IdentityType, TeamsFx } from '@microsoft/teamsfx';

import { currentEmployeeChanged } from '../../../features/employees/employeeSlice';
import { newEmployee } from '../../../features/employees/types';
import { userDetailsChanged } from '../../../features/user/userSlice';
import { RootState, useAppDispatch, useTypedSelector } from '../../../store';
import Loader from '../Loader';

const UserSwitchDropdown = (props: {} & DropdownProps): JSX.Element => {
   const { ...otherProps } = props;
   const dispatch = useAppDispatch();
   const currentUser = useTypedSelector((state: RootState) => state.currentUser);

   const dropdownOptions = [
      {
         key: 'HR.Staff@africaprudential.com',
         header: 'Test Employee',
         content: 'This user is used to create goals and submit for review, etc.'
      },
      {
         key: 'HR.Line1@africaprudential.com',
         header: 'Test Line Manager 1',
         content: '1st manager of the test employee. Only one responsible to provide appraisal goal results.'
      },
      {
         key: 'HR.Line2@africaprudential.com',
         header: 'Test Line Manager 2',
         content: '2nd manager of the test employee. Only responsible to approve / reject initial goal setting and appraisal.'
      },
      {
         key: 'HR.Test@africaprudential.com',
         header: 'Test HR Employee',
         content: 'This user is used to manage the general app config and final approver.'
      }
   ];
   const defaultOption = dropdownOptions[0];

   const handleOnChange = (event: any, value: string) => {
      const userCtx = {
         displayName: currentUser.displayName,
         upn: value.toLowerCase(),
         id: currentUser.id,
         locale: currentUser.locale,
      }
      dispatch(userDetailsChanged(userCtx));
      dispatch(currentEmployeeChanged(newEmployee));
   }

   const firstLogin = async () => {
      try {
         var graphScope = process.env.REACT_APP_GRAPHSCOPE || '';
         const teamsfx = new TeamsFx(IdentityType.User);
         await teamsfx.login(graphScope.split(' '));
      } catch (err: unknown) {
         if (err instanceof ErrorWithCode && err.code !== ErrorCode.ConsentFailed) {
            throw err;
         } else {
            // Silently fail because user cancels the consent dialog
            return;
         }
      }
   }

   return (
      <Flex hAlign="center" gap="gap.medium">
         <Dropdown
            {...otherProps}
            fluid
            items={dropdownOptions}
            defaultValue={defaultOption}
            onChange={(event, { value }: { value?: any }) =>
               handleOnChange(event, value ? value.key : "")
            }
            className='mmt-userSwitchDropdown'
            styles={{
               maxWidth: '300px',
               minWidth: '300px'
            }}
         />
         <Button
            content={`Consent`}
            onClick={firstLogin}
         />
      </Flex>
   );
}

export default UserSwitchDropdown;