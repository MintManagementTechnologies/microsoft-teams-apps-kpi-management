import { getDefaultStartAndEndTimes } from '../utils/sharedFunctions';

interface IMeetingInfo {
   attendees: string;
   startTime: string;
   endTime: string;
   subject: string;
   content: string;
}

interface IGroupChatInfo {
   users: string;
   topicName: string;
   message: string;
}

const baseNewMeetingDeeplink = "https://teams.microsoft.com/l/meeting/new";
const baseNewGroupChatDeeplink = "https://teams.microsoft.com/l/chat/0/0";

export const createMeetingDeeplink = (_usersUPN: string[], _stage: string = "appraisal") => {
   const meetingInfo = createMeetingInfo(_usersUPN, _stage);
   var queryString = Object.keys(meetingInfo).map((key) => {
      //@ts-ignore
      return encodeURIComponent(key) + '=' + encodeURIComponent(meetingInfo[key])
   }).join('&');
   return `${baseNewMeetingDeeplink}?${queryString}`;
}

export const createGroupChatDeeplink = (_usersUPN: string[], _stage: string = "appraisal") => {
   const groupChatInfo = createGroupChatInfo(_usersUPN, _stage);
   var queryString = Object.keys(groupChatInfo).map((key) => {
      //@ts-ignore
      return encodeURIComponent(key) + '=' + encodeURIComponent(groupChatInfo[key])
   }).join('&');
   return `${baseNewGroupChatDeeplink}?${queryString}`;
}

export const createMeetingInfo = (_usersUPN: string[], _stage: string):IMeetingInfo => {
   const { startTime, endTime } = getDefaultStartAndEndTimes();
   const additionalInfo = {
      startTime: startTime,
      endTime: endTime,
      subject: _stage === "appraisal" ? "Appraisal Meeting" : "Goals Meeting",
      content: `This meeting is to discuss the ${_stage}s submitted`,
      attendees: _usersUPN.join(',')
   }
   return additionalInfo;
}

export const createGroupChatInfo = (_usersUPN: string[], _stage: string):IGroupChatInfo => {
   const additionalInfo = {
      topicName: _stage === "appraisal" ? "Appraisal Chat" : "Goals Chat",
      message: "",
      users: _usersUPN.join(','),
   }
   return additionalInfo;
}

// Open a scheduling dialog from your tab
// if (calendar.isSupported()) {
//    const calendarPromise = calendar.composeMeeting({
//       attendees: ["joe@contoso.com", "bob@contoso.com"],
//       content: "test content",
//       endTime: "202210-24T10:30:00-07:00",
//       startTime: "2022-10-24T10:00:00-07:00",
//       subject: "test subject",
//    });
//    calendarPromise.
//       then((result) => {
//          debugger;
//          /*Successful operation*/ }).
//       catch((error) => {
//          debugger;
//          /*Unsuccessful operation*/ });
// }
// else { 
//    debugger;
//    /* handle case where capability isn't supported */ 
// }
// Open a scheduling dialog from your tab