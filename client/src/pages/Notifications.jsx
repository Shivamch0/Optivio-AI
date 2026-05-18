import {
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api.js";
import { useWorkspaceData } from "../hooks/useWorkspaceData.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { LoadingPanel } from "../components/common/LoadingState.jsx";
import { buttonLight, formatDate, pageShell, panel } from "../utils/dashboard.js";

export default function Notifications({ user }) {
  const { loading, notifications, setNotifications } = useWorkspaceData();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markRead = async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item)),
    );
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  const remove = async (notificationId) => {
    await deleteNotification(notificationId);
    setNotifications((current) => current.filter((item) => item._id !== notificationId));
  };

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="mt-2 text-sm text-[#667085]">Audit completions, ranking updates, read/unread state, and system alerts.</p>
          </div>
          <button type="button" onClick={markAllRead} className={buttonLight} disabled={!unreadCount}>Mark all read ({unreadCount})</button>
        </div>

        {loading ? (
          <div className="mt-6">
            <LoadingPanel label="Loading notifications" detail="Collecting the latest audit and ranking alerts..." />
          </div>
        ) : (
        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {notifications.map((notification) => (
            <article key={notification._id} className={`${panel} ${notification.isRead ? "" : "ring-2 ring-[#bfdbfe]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{notification.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{notification.message}</p>
                </div>
                <span className="rounded-full bg-[#f3f6fb] px-2 py-1 text-[11px] font-bold uppercase text-[#667085]">{notification.priority}</span>
              </div>
              <p className="mt-3 text-xs text-[#98a2b3]">{formatDate(notification.createdAt)}</p>
              <div className="mt-4 flex gap-4">
                {!notification.isRead && <button type="button" onClick={() => markRead(notification._id)} className="text-xs font-bold text-[#175cd3]">Mark read</button>}
                <button type="button" onClick={() => remove(notification._id)} className="text-xs font-bold text-red-600">Delete</button>
              </div>
            </article>
          ))}
          {!notifications.length && <div className={panel}><p className="text-sm text-[#667085]">No notifications yet.</p></div>}
        </section>
        )}
      </div>
    </AppLayout>
  );
}
