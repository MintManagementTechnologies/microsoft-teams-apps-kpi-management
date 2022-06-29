const modalHeaderHeight = 0;//70;

const defaultModal = {
   view: 'default',
   action: 'default',
   dimensions: {
      height: 700,
      width: 1200
   }
}

// subtract 70  height for taskModule header
const modals = [
   {
      view: 'goal',
      actions: ['new','view','edit'],
      dimensions: {
         height: 691-modalHeaderHeight,
         width: 680
      }
   },
   {
      view: 'period',
      actions: ['new','view','edit'],
      dimensions: {
         height: 495-modalHeaderHeight,
         width: 646
      }
   },
   {
      view: 'competency',
      actions: ['new','view','edit'],
      dimensions: {
         height: 495-modalHeaderHeight,
         width: 646
      }
   },
   {
      view: 'goalbatch',
      actions: ['submit', 'approve'],
      dimensions: {
         height: 500-modalHeaderHeight,
         width: 680
      }
   },
   {
      view: 'appraisal',
      actions: ['submit', 'approve'],
      dimensions: {
         height: 495-modalHeaderHeight,
         width: 680
      }
   },
]

export const getDimensions = (_view: string = '', _action: string = ''): { height: number, width: number } => {
   const modalProps = modals.find(x => x.view === _view && x.actions.includes(_action));
   let result = modalProps ? modalProps.dimensions : defaultModal.dimensions;
   return result;
}