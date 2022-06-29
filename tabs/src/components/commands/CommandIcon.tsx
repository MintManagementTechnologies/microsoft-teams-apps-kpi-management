import {
   EyeFriendlierIcon,
   UrgentIcon,
   SendIcon,
   AddIcon,
   EditIcon,
   TrashCanIcon,
   ChatIcon,
   MeetingNewIcon,
   StarIcon,
} from "@fluentui/react-northstar";

type CommandIconModel = { name: string; icon: JSX.Element };

const CommandIcon = (props: { name: string }): JSX.Element => {
   const iconArray: CommandIconModel[] = [
      {
         name: "new",
         icon: <AddIcon />,
      },
      {
         name: "pencil",
         icon: <EditIcon />,
      },
      {
         name: "trashcan",
         icon: <TrashCanIcon />,
      },
      {
         name: "send",
         icon: <SendIcon />,
      },
      {
         name: "chat",
         icon: <ChatIcon />,
      },
      {
         name: "newMeeting",
         icon: <MeetingNewIcon />,
      },
      {
         name: "eye",
         icon: <EyeFriendlierIcon />,
      },
      {
         name: "hand",
         icon: <StarIcon />,
      },
      {
         name: "default",
         icon: <UrgentIcon />,
      },
   ];

   let iconModel = props.name
      ? (iconArray.find((x) => x.name === props.name) as CommandIconModel)
      : iconArray.find((x) => x.name === "default");
      
   if(!iconModel)
      iconModel = iconArray.find((x) => x.name === "default");
   return iconModel!.icon;
};

export default CommandIcon;
