import api from "./axios.js";

const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

const markNotificationRead = async (notificationId) => {
  const res = await api.patch(`/notifications/${notificationId}/read`);
  return res.data;
};

const markAllNotificationsRead = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data;
};

const deleteNotification = async (notificationId) => {
  const res = await api.delete(`/notifications/${notificationId}`);
  return res.data;
};

export {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
};
