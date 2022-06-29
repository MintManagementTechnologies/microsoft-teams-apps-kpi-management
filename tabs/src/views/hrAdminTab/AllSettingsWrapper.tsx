import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Flex, Loader, Menu, tabListBehavior, Text } from '@fluentui/react-northstar';

import ErrorMessage from '../../components/common/ErrorMessage';
import { RootState, useTypedSelector } from '../../store';
import BrowseAppraisalPeriods from './BrowseSettings/BrowseAppraisalPeriods';
import BrowseCompetencies from './BrowseSettings/BrowseCompetencies';
import BrowseKeyResultAreas from './BrowseSettings/BrowseKeyResultAreas';

const AllSettingsWrapper = (props: { isLoading: boolean }): JSX.Element => {
   const { isLoading } = props;
   const { section } = useParams<{ section: string }>();
   const { pathname } = useLocation();
   let [searchParams, setSearchParams] = useSearchParams();
   const { t, i18n } = useTranslation();
   const navigate = useNavigate();

   const renderBrowseComponent = (_ctx: string = '') => {
      switch (_ctx) {
         case 'krabrowse':
            return <BrowseKeyResultAreas />;
         case 'competencybrowse':
            return <BrowseCompetencies />;
         case 'periodbrowse':
            return <BrowseAppraisalPeriods />;
         default:
            return <ErrorMessage message={t('error.hradmin.view')} messageDetails={`Could not find the ${_ctx} in the AllSettingsWrapper`} />;
      }
   }

   const contextNavItems = [
      {
         key: 'krabrowse',
         content: t('entity.kra', { count: 0 }),
         className: section === 'krabrowse' ? 'mmt-selected' : '',
      },
      {
         key: 'competencybrowse',
         content: t('entity.competency', { count: 0 }),
         className: section === 'competencybrowse' ? 'mmt-selected' : '',
      },
      {
         key: 'periodbrowse',
         content: t('entity.appraisalPeriod', { count: 0 }),
         className: section === 'periodbrowse' ? 'mmt-selected' : '',
      },
   ];

   const handleOnItemClick = (event: any, item: any) => {
      const newSection = contextNavItems[item.index].key;
      // dispatch(settingsSectionChanged(ctxItems[item.index].key));
      // let layout = searchParams.get("layout");
      // const path = `/${cmd.value.path}?layout=${layout}`
      const newPath = pathname.replace(section || '', newSection);
      navigate(newPath);
   }

   return (
      <>{isLoading ? (
         <Loader label={t(`loading`)} style={{ margin: 100 }} />
      ) : (
         <>
            <Flex fill column gap={'gap.small'} className={`mmt-allSettings-container`}>
               {/* <Row key='goalsApprovalStatusBar-row' className='mmt-goalsApprovalStatusBar mmt-rowGutter-10' xl={4} lg={4} md={3} sm={1}>
                  <CommandButton command={getContextCommand(settingsContext)} primary itemId={`1`} />
               </Row> */}
               <Row className='mmt-rowGutter-10 mmt-container-row'>
                  <Col xl={2} lg={2} md={2} sm={12} className="gx-0">
                     <Flex className={`mmt-settingsContextNav mmt-contextNav-container`} fill column>
                        <Text content={`Settings`} weight={'bold'} color="brand" size="large" className="mmt-contextNav-title" />
                        <Menu defaultActiveIndex={0} accessibility={tabListBehavior} className={`mmt-contextNav mmt-settings`}
                           items={contextNavItems}
                           vertical
                           fluid
                           onItemClick={(event, item) => { handleOnItemClick(event, item) }}
                        />
                     </Flex>
                  </Col>
                  <Col xl={10} lg={10} md={10} sm={12} className="gx-5 mmt-col-content mmt-col-settings">
                     {/* <CommandButton command={getContextCommand(settingsContext)} primary itemId={`1`} /> */}
                     <Flex column gap={'gap.medium'} className="mmt-settingsContent-container" >
                        {renderBrowseComponent(section)}
                     </Flex>
                  </Col>
               </Row>
            </Flex>
         </>
      )}
      </>
   );
}

export default AllSettingsWrapper;