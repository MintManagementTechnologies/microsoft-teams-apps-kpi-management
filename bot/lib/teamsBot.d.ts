import { TeamsActivityHandler, TurnContext, AdaptiveCardInvokeValue, AdaptiveCardInvokeResponse } from "botbuilder";
export interface DataInterface {
    likeCount: number;
}
export declare class TeamsBot extends TeamsActivityHandler {
    likeCountObj: {
        likeCount: number;
    };
    constructor();
    onAdaptiveCardInvoke(context: TurnContext, invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse>;
    handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: any): Promise<any>;
    handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any>;
    handleTeamsMessagingExtensionSelectItem(context: TurnContext, obj: any): Promise<any>;
    handleTeamsAppBasedLinkQuery(context: TurnContext, query: any): Promise<any>;
}
