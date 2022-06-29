import NewUserAction from "./newUser";
import EditUserAction from "./editUser";
import DeleteUserAction from "./deleteUser";
import ViewUserAction from "./viewUser";

export const userActions = [
   new NewUserAction('topBar'),
   new ViewUserAction('topBar'),
   new EditUserAction('topBar'),
   new DeleteUserAction('topBar')
]