import './common/helpers/stringHelpers';
import './index.scss';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';

//import { setupBrowserMock } from "./mocks/apiHandler";

console.clear();
//setupBrowserMock();

ReactDOM.render(
   <Provider store={store}>
       <App />
   </Provider>, 
   document.getElementById("root")
);
