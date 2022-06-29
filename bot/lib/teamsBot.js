"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsBot = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring = __importStar(require("querystring"));
const botbuilder_1 = require("botbuilder");
const welcome_json_1 = __importDefault(require("./adaptiveCards/welcome.json"));
const learn_json_1 = __importDefault(require("./adaptiveCards/learn.json"));
const adaptivecards_tools_1 = require("@microsoft/adaptivecards-tools");
class TeamsBot extends botbuilder_1.TeamsActivityHandler {
    constructor() {
        super();
        this.likeCountObj = { likeCount: 0 };
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("Running with Message Activity.");
            let txt = context.activity.text;
            const removedMentionText = botbuilder_1.TurnContext.removeRecipientMention(context.activity);
            if (removedMentionText) {
                // Remove the line break
                txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
            }
            // Trigger command by IM text
            switch (txt) {
                case "welcome": {
                    const card = adaptivecards_tools_1.AdaptiveCards.declareWithoutData(welcome_json_1.default).render();
                    yield context.sendActivity({ attachments: [botbuilder_1.CardFactory.adaptiveCard(card)] });
                    break;
                }
                case "learn": {
                    this.likeCountObj.likeCount = 0;
                    const card = adaptivecards_tools_1.AdaptiveCards.declare(learn_json_1.default).render(this.likeCountObj);
                    yield context.sendActivity({ attachments: [botbuilder_1.CardFactory.adaptiveCard(card)] });
                    break;
                }
                /**
                 * case "yourCommand": {
                 *   await context.sendActivity(`Add your response here!`);
                 *   break;
                 * }
                 */
            }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id) {
                    const card = adaptivecards_tools_1.AdaptiveCards.declareWithoutData(welcome_json_1.default).render();
                    yield context.sendActivity({ attachments: [botbuilder_1.CardFactory.adaptiveCard(card)] });
                    break;
                }
            }
            yield next();
        }));
    }
    // Invoked when an action is taken on an Adaptive Card. The Adaptive Card sends an event to the Bot and this
    // method handles that event.
    onAdaptiveCardInvoke(context, invokeValue) {
        return __awaiter(this, void 0, void 0, function* () {
            // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
            if (invokeValue.action.verb === "userlike") {
                this.likeCountObj.likeCount++;
                const card = adaptivecards_tools_1.AdaptiveCards.declare(learn_json_1.default).render(this.likeCountObj);
                yield context.updateActivity({
                    type: "message",
                    id: context.activity.replyToId,
                    attachments: [botbuilder_1.CardFactory.adaptiveCard(card)],
                });
                return { statusCode: 200, type: undefined, value: undefined };
            }
        });
    }
    // Messaging extension Code
    // Action.
    handleTeamsMessagingExtensionSubmitAction(context, action) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (action.commandId) {
                case "createCard":
                    return createCardCommand(context, action);
                case "shareMessage":
                    return shareMessageCommand(context, action);
                default:
                    throw new Error("NotImplemented");
            }
        });
    }
    // Search.
    handleTeamsMessagingExtensionQuery(context, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchQuery = query.parameters[0].value;
            const response = yield axios_1.default.get(`http://registry.npmjs.com/-/v1/search?${querystring.stringify({
                text: searchQuery,
                size: 8,
            })}`);
            const attachments = [];
            response.data.objects.forEach((obj) => {
                const heroCard = botbuilder_1.CardFactory.heroCard(obj.package.name);
                const preview = botbuilder_1.CardFactory.heroCard(obj.package.name);
                preview.content.tap = {
                    type: "invoke",
                    value: { name: obj.package.name, description: obj.package.description },
                };
                const attachment = Object.assign(Object.assign({}, heroCard), { preview });
                attachments.push(attachment);
            });
            return {
                composeExtension: {
                    type: "result",
                    attachmentLayout: "list",
                    attachments: attachments,
                },
            };
        });
    }
    handleTeamsMessagingExtensionSelectItem(context, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                composeExtension: {
                    type: "result",
                    attachmentLayout: "list",
                    attachments: [botbuilder_1.CardFactory.heroCard(obj.name, obj.description)],
                },
            };
        });
    }
    // Link Unfurling.
    handleTeamsAppBasedLinkQuery(context, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = botbuilder_1.CardFactory.thumbnailCard("Image Preview Card", query.url, [query.url]);
            const result = {
                attachmentLayout: "list",
                type: "result",
                attachments: [attachment],
            };
            const response = {
                composeExtension: result,
            };
            return response;
        });
    }
}
exports.TeamsBot = TeamsBot;
function createCardCommand(context, action) {
    return __awaiter(this, void 0, void 0, function* () {
        // The user has chosen to create a card by choosing the 'Create Card' context menu command.
        const data = action.data;
        const heroCard = botbuilder_1.CardFactory.heroCard(data.title, data.text);
        heroCard.content.subtitle = data.subTitle;
        const attachment = {
            contentType: heroCard.contentType,
            content: heroCard.content,
            preview: heroCard,
        };
        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: [attachment],
            },
        };
    });
}
function shareMessageCommand(context, action) {
    return __awaiter(this, void 0, void 0, function* () {
        // The user has chosen to share a message by choosing the 'Share Message' context menu command.
        let userName = "unknown";
        if (action.messagePayload &&
            action.messagePayload.from &&
            action.messagePayload.from.user &&
            action.messagePayload.from.user.displayName) {
            userName = action.messagePayload.from.user.displayName;
        }
        // This Messaging Extension example allows the user to check a box to include an image with the
        // shared message.  This demonstrates sending custom parameters along with the message payload.
        let images = [];
        const includeImage = action.data.includeImage;
        if (includeImage === "true") {
            images = [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtB3AwMUeNoq4gUBGe6Ocj8kyh3bXa9ZbV7u1fVKQoyKFHdkqU",
            ];
        }
        const heroCard = botbuilder_1.CardFactory.heroCard(`${userName} originally sent this message:`, action.messagePayload.body.content, images);
        if (action.messagePayload &&
            action.messagePayload.attachment &&
            action.messagePayload.attachments.length > 0) {
            // This sample does not add the MessagePayload Attachments.  This is left as an
            // exercise for the user.
            heroCard.content.subtitle = `(${action.messagePayload.attachments.length} Attachments not included)`;
        }
        const attachment = {
            contentType: heroCard.contentType,
            content: heroCard.content,
            preview: heroCard,
        };
        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: [attachment],
            },
        };
    });
}
//# sourceMappingURL=teamsBot.js.map