import * as React from 'react';
import { Breadcrumb, ChevronEndMediumIcon } from "@fluentui/react-northstar";
import { getRouteParams } from '../../common/utils/sharedFunctions';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const BreadcrumbNav = (props: { currentNode: string }): JSX.Element => {
   const { pathname } = useLocation();
   const { currentNode } = props;
   const {
      userScope,
      view,
      action,
      id
   } = getRouteParams(pathname);

   let [searchParams, setSearchParams] = useSearchParams();
   const layout = searchParams.get("layout") || 'list';
   const queryParams = `?layout=${layout}`;
   ///#/team/mygoals/browse/1queryParams
   return (
      <Breadcrumb aria-label="breadcrumb">
         <Breadcrumb.Item>
            <Breadcrumb.Link as={Link} content={`Dashboard`} className="mmt-label mmt-themeColorOverride"
               to={{ pathname: `/${userScope}/${view}/browse/1${queryParams}` }}
            />
         </Breadcrumb.Item>
         <Breadcrumb.Divider>
            <ChevronEndMediumIcon className="mmt-label mmt-themeColorOverride" />
         </Breadcrumb.Divider>
         <Breadcrumb.Item aria-current="page" className="mmt-label mmt-themeColorOverride" >{currentNode}</Breadcrumb.Item>
      </Breadcrumb>
   );
}

export default BreadcrumbNav;