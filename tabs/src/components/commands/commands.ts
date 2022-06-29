export interface ICommand {
    id: number;
    internalName: string;
    alternativeName: string;
    displayName?: string;
    taskModuleName?: string;
    iconName: string;
    type: string;
    value: any | {path: string};
    availableIn?: {
        views: string[];
        scopes: string[];
        statuses: string[];
    }
}

const commands:ICommand[] = [
    {
        "id": 1,
        "internalName": "newGoal",
        "alternativeName": "new",
        "taskModuleName": "modal.myGoals.new.name",
        "displayName": "Add a New Goal",
        "iconName": "new",
        "type": "taskModule",
        "value": {
            "path": "mygoals/new"
        },
        "availableIn": {
            "views": ["mygoals"],
            "scopes": ["card", "contextNav", "taskModule"],
            "statuses": ["created", "inProgress", "complete"]
        }
    },
    {
        "id": 2,
        "internalName": "submitGoals",
        "alternativeName": "submit",
        "displayName": "Submit for Approval",
        "iconName": "send",
        "type": "taskModule",
        "value": {
            "path": "/mygoals/submitGoals"
        },
        "availableIn": {
            "views": ["mygoals"],
            "scopes": ["card", "contextNav", "taskModule"],
            "statuses": ["created", "inProgress", "complete"]
        }
    },
   //  {
   //      "id": 3,
   //      "internalName": "goalDetails",
   //      "alternativeName": "details",
   //      "displayName": "View Details",
   //      "iconName": "eye",
   //      "type": "taskModule",
   //      "value": {
   //          "path": "/mygoals/details"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["card", "contextNav", "taskModule"],
   //          "statuses": ["created", "inProgress", "complete"]
   //      }
   //  },
   //  {
   //      "id": 3,
   //      "internalName": "approvalForm",
   //      "alternativeName": "approvalForm",
   //      "displayName": "View All Details",
   //      "iconName": "eye",
   //      "type": "link",
   //      "value": {
   //          "path": "mygoals/approvalForm"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["card", "contextNav", "taskModule"],
   //          "statuses": ["created", "inProgress", "complete"]
   //      }
   //  },
   //  {
   //      "id": 4,
   //      "internalName": "editGoal",
   //      "alternativeName": "edit",
   //      "displayName": "Edit Goal",
   //      "iconName": "pencil",
   //      "type": "taskModule",
   //      "value": {
   //          "path": "/mygoals/edit"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["card", "contextNav", "taskModule"],
   //          "statuses": ["created", "inProgress", "complete"]
   //      }
   //  },
   //  {
   //      "id": 5,
   //      "internalName": "deleteGoal",
   //      "alternativeName": "delete",
   //      "displayName": "Delete Goal",
   //      "iconName": "trashcan",
   //      "type": "taskModule",
   //      "value": {
   //          "path": "/mygoals/delete"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["card", "contextNav", "taskModule"],
   //          "statuses": ["created", "inProgress", "complete"]
   //      }
   //  },
    {
        "id": 6,
        "internalName": "myGoals",
        "alternativeName": "me",
        "displayName": "myGoals",
        "iconName": "",
        "type": "link",
        "value": {
            "path": "/me/mygoals/browse/1"
        },
        "availableIn": {
            "views": ["mygoals"],
            "scopes": ["topActionsBar"],
            "statuses": []
        }
    },
    {
        "id": 7,
        "internalName": "teamGoals",
        "alternativeName": "team",
        "displayName": "Team Goals",
        "iconName": "",
        "type": "link",
        "value": {
            "path": "/team/mygoals/browse/1"
        },
        "availableIn": {
            "views": ["mygoals"],
            "scopes": ["topActionsBar"],
            "statuses": []
        }
    },
   //  {
   //      "id": 7,
   //      "internalName": "userGoalsConversation",
   //      "alternativeName": "conversation",
   //      "displayName": "Start a conversation",
   //      "iconName": "chat",
   //      "type": "link",
   //      "value": {
   //          "path": "mygoals/browse/1"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["topActionsBar"],
   //          "statuses": []
   //      }
   //  },
   //  {
   //      "id": 7,
   //      "internalName": "userGoalsMeeting",
   //      "alternativeName": "meeting",
   //      "displayName": "Start a meeting",
   //      "iconName": "newMeeting",
   //      "type": "link",
   //      "value": {
   //          "path": "mygoals/browse/1"
   //      },
   //      "availableIn": {
   //          "views": ["mygoals"],
   //          "scopes": ["topActionsBar"],
   //          "statuses": []
   //      }
   //  },
    {
        "id": 8,
        "internalName": "submitGoalBatchReview",
        "alternativeName": "submitGoalBatch",
        "displayName": "",
        "iconName": "",
        "type": "taskModule",
        "value": {
            "path": "/mygoals/"
        },
        "availableIn": {
            "views": ["mygoals"],
            "scopes": ["card", "contextNav", "taskModule"],
            "statuses": ["created", "inProgress", "complete"]
        }
    },
]
// export type statusEnum = "created" | "started" | "inProgress" | "complete" | "overdue" | "revisionInProgress";
// export type outcomeEnum = "pending" | "approved" | "rejected" | "returned" | "signed" | "skipped";
export const getCommands = (_view: string, _scope: string, _status: string) => {
    let filteredCommands = commands.filter((x) => x.availableIn!.views.includes(_view) && x.availableIn!.scopes.includes(_scope) && x.availableIn!.statuses.includes(_status))
    return filteredCommands;
}

export const getSingleCommand = (_internalName: string) => {
    let command = commands.find((x) => x.internalName === _internalName)
    return command;
}