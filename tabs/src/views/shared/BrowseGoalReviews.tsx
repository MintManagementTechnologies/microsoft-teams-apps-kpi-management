import './BrowseGoalReviews.scss';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@fluentui/react-northstar';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import Loader from '../../components/common/Loader';
import {
    useGetEmployeeByIdQuery, useLazyGetEmployeeManagersQuery
} from '../../features/employees/employeeService';
import { itemChanged, itemManagersChanged } from '../../features/employees/employeeSlice';
import UsersBar from '../../features/user/parts/UsersBar';
import { RootState, useAppDispatch, useTypedSelector } from '../../store';

const BrowseGoalReviews = (props: {
   isLoading: boolean,
   employeeId: number,
   reviewDescription?: string,
   children?: React.ReactNode
}): JSX.Element => {
   const { employeeId, reviewDescription } = props;
   const [userUPNs, setUserUPNs] = useState<string[]>([]);
   const browseGoalReviewsRef = useRef(null);
   const selectedKRA = useTypedSelector((state: RootState) => state.keyResultArea.itemId);

   const { t, i18n } = useTranslation();
   const dispatch = useAppDispatch();

   const { data: dataGetEmployeeById, error, isLoading: isLoadingGetEmployeeById, isFetching: isFetchingGetEmployeeById }
      = useGetEmployeeByIdQuery(employeeId || skipToken);

   const [triggerGetEmployeeManagers,
      { data: dataGetEmployeeManagers, isFetching: isFetchingGetEmployeeManagers, isLoading: isLoadingGetEmployeeManagers }]
      = useLazyGetEmployeeManagersQuery();

   useEffect(() => {
      // (viewGoalBatchRef as any).current?.scrollIntoView({ behavior: "smooth" });
      if (!(browseGoalReviewsRef as any).current) return;
      (browseGoalReviewsRef as any).current.scrollTop = 0;
   }, [selectedKRA]);

   useEffect(() => {
      if (!dataGetEmployeeById) return;
      dispatch(itemChanged(dataGetEmployeeById));
      triggerGetEmployeeManagers(dataGetEmployeeById.managers.map(x => x.id));
   }, [dataGetEmployeeById]);

   useEffect(() => {
      if (!dataGetEmployeeManagers || !dataGetEmployeeById) return;
      const managerUPNs = dataGetEmployeeManagers.map(x => x.upn);
      const managerDetails = dataGetEmployeeManagers.map(x => ({ upn: x.upn, id: x.id }));
      dispatch(itemManagersChanged(managerDetails));
      setUserUPNs([dataGetEmployeeById.upn, ...managerUPNs]);
   }, [dataGetEmployeeManagers]);

   const isLoading = props.isLoading || isLoadingGetEmployeeById || isFetchingGetEmployeeById || isLoadingGetEmployeeManagers || isFetchingGetEmployeeManagers;
   return (
      <>{isLoading ? (<Loader message={t('entity.goalBatch', { count: 0 })} />
      ) : (
         <Flex className={`mmt-browseGoalReviews`} fill column gap={'gap.small'} ref={browseGoalReviewsRef}>
            <Text content={reviewDescription} />
            <UsersBar userUPNs={userUPNs} />
            {props.children}
         </Flex>
      )}
      </>
   );
}

export default BrowseGoalReviews;