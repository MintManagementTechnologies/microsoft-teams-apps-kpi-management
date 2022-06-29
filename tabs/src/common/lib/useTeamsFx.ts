import { useTeams } from 'msteams-react-base-component';
import { useEffect } from 'react';

import { IProvider, Providers, ProviderState } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { Client } from '@microsoft/microsoft-graph-client';
import {
    createMicrosoftGraphClient, IdentityType, LogLevel, setLogFunction, setLogLevel, TeamsFx
} from '@microsoft/teamsfx';

import { userDetailsChanged } from '../../features/user/userSlice';
import { setClientInstance } from '../../services/graphApiService';
import { useAppDispatch } from '../../store';
import { setLocale } from '../utils/i18n';
import { getLocale } from '../utils/sharedFunctions';
import { useData } from './useData';

var startLoginPageUrl = process.env.REACT_APP_START_LOGIN_PAGE_URL;
var functionEndpoint = process.env.REACT_APP_FUNC_ENDPOINT;
var clientId = process.env.REACT_APP_CLIENT_ID;
var graphScope = process.env.REACT_APP_GRAPHSCOPE;

// TODO fix this when the SDK stops hiding global state!
let initialized = false;
let ctxInitialized = false;
let userCtx = {
   displayName: '',
   upn: '',
   id: '' as any,
   locale: '',
}

export function useTeamsFx() {
   let graphClient:Client|null = null;
   const dispatch = useAppDispatch();
   const [result] = useTeams({});
   let isAuthenticated = false;
   if (result.context && !ctxInitialized) {
      ctxInitialized = true;
      userCtx = {
         displayName: '',
         upn: result.context?.userPrincipalName ? result.context?.userPrincipalName.toLowerCase() : '',
         // upn: 'HR.Staff@africaprudential.com'.toLowerCase(),
         id: result.context?.userObjectId || undefined,
         locale: result.context?.locale || getLocale(),
      }
      console.error('START-userCtx');
      console.log(userCtx);
      console.error('END-userCtx');
   }
   useEffect(() => {
      if (ctxInitialized) {
         dispatch(userDetailsChanged(userCtx));
         setLocale(userCtx.locale);
      }
   }, [dispatch]);

   const { error, loading, reload } = useData(async () => {
      if (!initialized) {
         if (process.env.NODE_ENV === "development") {
            setLogLevel(LogLevel.Verbose);
            setLogFunction((leve: LogLevel, message: string) => { console.log(message); });
         }
         let scope = graphScope ? graphScope.split(' ') : ['User.Read'];
         const teamsfx = new TeamsFx(IdentityType.User);
			graphClient = await createMicrosoftGraphClient(teamsfx, scope);
         isAuthenticated = true;
         setClientInstance(graphClient);
         await teamsfx.login(scope);
         console.log("Logged in. FINALLY");
         initialized = true;
      }
   });
   return { error, reload, loading, isAuthenticated, userCtx, graphClient, ...result };
}
