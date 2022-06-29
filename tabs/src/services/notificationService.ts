import { baseNotificationApi } from './';

export interface INotificationData {
   recipients: string[];
   cardData: {
      title: string;
      subtitle: string;
      url?: string;
      approvers: {
         order: number;
         displayName: string;
         image: string;
      } [];
   };
}

export const notificationService = baseNotificationApi.injectEndpoints({
   endpoints: (build) => ({
      notify: build.mutation<void, any>({
         query(item) {
            const body = {
               recipients: [item],
               cardData: {
                  title: "WERNER",
                  subtitle: "Ek kyk vir jou...",
                  url: "https://teams.microsoft.com/l/entity/4cc11c45-ef54-4b3e-84fc-ad3ccb631018/myappraisals",
                  approvers: [{
                     order: 1,
                     displayName: "Werner Beytelefoon",
                     image: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+vLfihBNrPinw3oEDPEZvMlkdTj5OAT+ADfmK9SrzrxXb3E/xH0m606S3a6gsriPZMxC7vlIDY5xhyeOu3FZ1fgZdP4jcj02whjEcdjbKgUKB5K9B0zxzWN4wkNlb6VqcJ2XVrqVusbDjKu2x0PsQentVCy1zWZPFi6VdapohwrK9vbQyeZv2kryxI7Zx6VhzalqPiHTJjNrGn3f2KSK5e2t7N4v9VKN7K7H5gMNn+lcUU1JO51O1j22ioLO8t7+1S5tZVlhf7rr0NT16JxBXmkjzjxoJ7hQsr38kQyOTHtIXn6Bfz969LrkfHOjo+mPrlrDI2paeUuEEZP7wI2SCvf5d3vWVWDlHQ0pSUXqRLpGk2WofbVRYJXGHG7iQA9cHv8AN1HPNOsNJ060R4o7e3aTpLtAb8/fgZ964nWnuvFM0stpqfk2bxqI4kXqCobn5STyT+XTvTtJn1vw+GuLnVkuNNtzH9oilgKnDNgBWIB3d+ewris+XVnVbXY7vwKPJ0/ULJYTHFaX0kKcYBAxjH4Y/HNdVXJfDlpbjwmL+bPmX11Pcn/gTnH6AV1tehBWijjm/eYVTh1K2ur2W0hLSGIHzHC/ID/dz0z7VS1a51W1vIjZrC9s6hXEjAFSW+8MnnqOK4vxR4+u/COqvplraLf3LxeZNKxKpHK33QFHbaMkcckVoot7EnN+JLOX4d+Ipvs/k3mj36M62LctCoPIx1UDcQrD6dqw77X9Mfw9LoeiwzeTdziZmuJvMctxhc/UCqNjreot4xXW9RR7qWWULOGXG5DwVHoAOnoQK9bk0bRri6u9LhhtVuLnT3KPHEAziQ+Xk8cFecj3zWFbD8sl5m8KvunY6JYDS9CsLAKq/Z7dIyF6ZAGf1q/Xz34f8deJvCMk+myIb63gZohDcbvkIJHyt1AyOnI9MV7R4Q1q48QeFrLUbqDybiRSJFCkAspIJGexxmuiVNxV+hhc/9k="
                  },
                  {
                     order: 2,
                     displayName: "Abrie BeyMovies",
                     image: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAwADADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+vLfihBNrPinw3oEDPEZvMlkdTj5OAT+ADfmK9SrzrxXb3E/xH0m606S3a6gsriPZMxC7vlIDY5xhyeOu3FZ1fgZdP4jcj02whjEcdjbKgUKB5K9B0zxzWN4wkNlb6VqcJ2XVrqVusbDjKu2x0PsQentVCy1zWZPFi6VdapohwrK9vbQyeZv2kryxI7Zx6VhzalqPiHTJjNrGn3f2KSK5e2t7N4v9VKN7K7H5gMNn+lcUU1JO51O1j22ioLO8t7+1S5tZVlhf7rr0NT16JxBXmkjzjxoJ7hQsr38kQyOTHtIXn6Bfz969LrkfHOjo+mPrlrDI2paeUuEEZP7wI2SCvf5d3vWVWDlHQ0pSUXqRLpGk2WofbVRYJXGHG7iQA9cHv8AN1HPNOsNJ060R4o7e3aTpLtAb8/fgZ964nWnuvFM0stpqfk2bxqI4kXqCobn5STyT+XTvTtJn1vw+GuLnVkuNNtzH9oilgKnDNgBWIB3d+ewris+XVnVbXY7vwKPJ0/ULJYTHFaX0kKcYBAxjH4Y/HNdVXJfDlpbjwmL+bPmX11Pcn/gTnH6AV1tehBWijjm/eYVTh1K2ur2W0hLSGIHzHC/ID/dz0z7VS1a51W1vIjZrC9s6hXEjAFSW+8MnnqOK4vxR4+u/COqvplraLf3LxeZNKxKpHK33QFHbaMkcckVoot7EnN+JLOX4d+Ipvs/k3mj36M62LctCoPIx1UDcQrD6dqw77X9Mfw9LoeiwzeTdziZmuJvMctxhc/UCqNjreot4xXW9RR7qWWULOGXG5DwVHoAOnoQK9bk0bRri6u9LhhtVuLnT3KPHEAziQ+Xk8cFecj3zWFbD8sl5m8KvunY6JYDS9CsLAKq/Z7dIyF6ZAGf1q/Xz34f8deJvCMk+myIb63gZohDcbvkIJHyt1AyOnI9MV7R4Q1q48QeFrLUbqDybiRSJFCkAspIJGexxmuiVNxV+hhc/9k="
                  }]
               }
            }
            return {
               url: `/sendNotification`,
               method: 'POST',
               body,
            };
         }
      }),
      notifyEmployee: build.mutation<void, INotificationData>({
         query(item) {
            return {
               url: `/sendNotification`,
               method: 'POST',
               body:item,
            };
         }
      }),
      sendMessage: build.mutation<void, any>({
         query(item) {
            return {
               url: `/sendMessage`,
               method: 'POST',
               body:item,
            };
         }
      }),
   }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   endpoints: notificationEndpoints,
   useNotifyMutation,
   useNotifyEmployeeMutation,
   useSendMessageMutation,
   // useLazyNotifyQuery,
} = notificationService
