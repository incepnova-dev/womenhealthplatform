import React, { useState, useEffect } from "react";
import patientData from "../../data/womenpatients.json";
import "../../styles/narisangha/narisangha.css";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import MainSection from "./main/MainSection";

export default function NariSangha() {
  const [mode, setMode] = useState("create");
  const [language, setLanguage] = useState("en");
  const [currentUser, setCurrentUser] = useState(null);
  
  // External connections and feeds state
  const [connections, setConnections] = useState({
    discord: false,
    facebook: false,
    reddit: false,
  });
  const [externalFeeds, setExternalFeeds] = useState([]);
  const [myExternalGroups, setMyExternalGroups] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [stage, setStage] = useState("maternal");
  const [myCreatedGroups, setMyCreatedGroups] = useState([]);
  const [viewMode, setViewMode] = useState("setup"); // setup, mygroups, discover

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    topics: "",
    languages: "",
    location: "",
    privacy: "public",
    platforms: "internal"
  });
  
  const [joinForm, setJoinForm] = useState({
    topics: "",
    ageRange: "",
    languages: "",
    platformPreference: "",
    anonymity: "ok"
  });

  // Fetch external data on mount and stage change
  useEffect(() => {
    fetchConnections();
    fetchExternalFeeds(stage);
    fetchMyExternalGroups();
    fetchMyCreatedGroups();
  }, [stage]);

  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/community/connections");
      const data = await res.json();
      setConnections(data);
    } catch (e) {
      console.error("Error fetching connections", e);
    }
  };

  const fetchExternalFeeds = async (lifeStage) => {
    setLoadingFeeds(true);
    try {
      const res = await fetch(`/api/community/external/feeds?stage=${lifeStage}`);
      const data = await res.json();
      setExternalFeeds(data.items || []);
    } catch (e) {
      console.error("Error fetching feeds", e);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const fetchMyExternalGroups = async () => {
    try {
      const res = await fetch("/api/community/external/my-groups");
      const data = await res.json();
      setMyExternalGroups(data.groups || []);
    } catch (e) {
      console.error("Error fetching external groups", e);
    }
  };

  const fetchMyCreatedGroups = async () => {
    try {
      const res = await fetch("/api/community/my-created-groups");
      const data = await res.json();
      setMyCreatedGroups(data.groups || []);
    } catch (e) {
      console.error("Error fetching created groups", e);
    }
  };

  const handleConnectProvider = async (provider) => {
    setConnectingProvider(provider);
    try {
      const res = await fetch(`/api/community/connect/${provider}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (e) {
      console.error("Error connecting provider", e);
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleFollowExternalGroup = async (group) => {
    try {
      await fetch("/api/community/sync-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: group.provider,
          externalId: group.id,
        }),
      });
      fetchExternalFeeds(stage);
    } catch (e) {
      console.error("Error syncing group", e);
    }
  };

  const handleCreateChange = (field) => (e) => {
    setCreateForm({ ...createForm, [field]: e.target.value });
  };

  const handleJoinChange = (field) => (e) => {
    setJoinForm({ ...joinForm, [field]: e.target.value });
  };

  const callAgent = async (path, body) => {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[agent] error:", err);
      alert("Agent service unavailable. Wire this to your backend.");
      throw err;
    }
  };

  const previewCreate = async () => {
    const payload = createForm;
    console.log("[agent] preview create:", payload);
    await callAgent("/agent/previewCommunity", { mode: "create", ...payload });
  };

  const continueCreate = async () => {
    const payload = createForm;
    console.log("[agent] create community:", payload);
    const result = await callAgent("/agent/createCommunity", { mode: "create", ...payload });
    // Refresh created groups after successful creation
    if (result) {
      fetchMyCreatedGroups();
      setViewMode("mygroups");
    }
  };

  const previewJoin = async () => {
    const payload = joinForm;
    console.log("[agent] preview join:", payload);
    await callAgent("/agent/previewCommunities", { mode: "join", ...payload });
  };

  const continueJoin = async () => {
    const payload = joinForm;
    console.log("[agent] search communities:", payload);
    const data = await callAgent("/agent/searchCommunities", {
      mode: "join",
      ...payload
    });
    console.log("[agent] searchCommunities response:", data);
  };

  const currentModeText =
    mode === "create"
      ? "You're in create mode; the agent will focus on setting up a new space."
      : "You're in join mode; the agent will search and curate existing communities.";

  return (
    <div className="page-shell">
      <Header 
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        setViewMode={setViewMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <MainSection
        mode={mode}
        setMode={setMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        createForm={createForm}
        handleCreateChange={handleCreateChange}
        previewCreate={previewCreate}
        continueCreate={continueCreate}
        joinForm={joinForm}
        handleJoinChange={handleJoinChange}
        previewJoin={previewJoin}
        continueJoin={continueJoin}
        myCreatedGroups={myCreatedGroups}
        myExternalGroups={myExternalGroups}
        connections={connections}
        connectingProvider={connectingProvider}
        handleConnectProvider={handleConnectProvider}
        stage={stage}
        setStage={setStage}
        loadingFeeds={loadingFeeds}
        externalFeeds={externalFeeds}
        fetchExternalFeeds={fetchExternalFeeds}
      />

      <Footer setViewMode={setViewMode} />
    </div>
  );
}
