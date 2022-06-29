import DeleteKeyResultAreaAction from './deleteKra';
import EditKeyResultAreaAction from './editKra';
import NewKeyResultAreaAction from './newKra';
import ViewKeyResultAreaAction from './viewKra';

export const kraActions = [
   new NewKeyResultAreaAction('topBar'),
   new ViewKeyResultAreaAction('topBar'),
   new EditKeyResultAreaAction('topBar'),
   new DeleteKeyResultAreaAction('topBar')
]