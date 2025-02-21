export const initialNotification = {
  data: [],
};

export function notificationActions(set, get) {
  return {
    addNotification: (notification) => {
      set((state) => {
        state.notification.data.push(notification);
      });
    },
    clearNotification: () => {
      set((state) => {
        state.notification.data = [];
      });
    },
  };
}
