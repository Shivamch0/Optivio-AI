import { useCallback, useEffect, useMemo, useState } from "react";
import { getKeywords } from "../api/keyword.api.js";
import { getNotifications } from "../api/notification.api.js";
import { getSeoReports, getWebsites } from "../api/website.api.js";
import { getErrorMessage } from "../utils/dashboard.js";

const savedWebsiteKey = "optivio:selectedWebsiteId";

export function useWorkspaceData() {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteIdState] = useState(
    () => localStorage.getItem(savedWebsiteKey) || "",
  );
  const [reports, setReports] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const selectedWebsite = useMemo(
    () => websites.find((website) => website._id === selectedWebsiteId),
    [selectedWebsiteId, websites],
  );

  const setSelectedWebsiteId = useCallback((websiteId) => {
    setSelectedWebsiteIdState(websiteId);
    if (websiteId) localStorage.setItem(savedWebsiteKey, websiteId);
    else localStorage.removeItem(savedWebsiteKey);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    }
  }, []);

  const loadWebsites = useCallback(
    async (preferredWebsiteId = "") => {
      try {
        const res = await getWebsites();
        setWebsites(res.data);
        const storedId = preferredWebsiteId || localStorage.getItem(savedWebsiteKey) || "";
        const nextId = res.data.some((website) => website._id === storedId)
          ? storedId
          : res.data[0]?._id || "";
        setSelectedWebsiteId(nextId);
      } catch (error) {
        setMessage(getErrorMessage(error, "Could not load websites."));
      } finally {
        setLoading(false);
      }
    },
    [setSelectedWebsiteId],
  );

  const loadWebsiteDetails = useCallback(async () => {
    if (!selectedWebsiteId) {
      setReports([]);
      setKeywords([]);
      return;
    }

    try {
      const [reportRes, keywordRes] = await Promise.all([
        getSeoReports(selectedWebsiteId),
        getKeywords(selectedWebsiteId),
      ]);
      setReports(reportRes.data);
      setKeywords(keywordRes.data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not load website details."));
    }
  }, [selectedWebsiteId]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadWebsites();
      loadNotifications();
    });
  }, [loadNotifications, loadWebsites]);

  useEffect(() => {
    Promise.resolve().then(loadWebsiteDetails);
  }, [loadWebsiteDetails]);

  return {
    keywords,
    loadNotifications,
    loadWebsiteDetails,
    loadWebsites,
    loading,
    message,
    notifications,
    reports,
    selectedWebsite,
    selectedWebsiteId,
    setKeywords,
    setMessage,
    setNotifications,
    setReports,
    setSelectedWebsiteId,
    setWebsites,
    websites,
  };
}
