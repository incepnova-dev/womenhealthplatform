import React from "react";
import HeroCard from "./HeroCard";
import ModeToggle from "./ModeToggle";
import CreateCard from "./CreateCard";
import JoinCard from "./JoinCard";
import CreatedGroupsList from "./CreatedGroupsList";
import ExternalGroupsList from "./ExternalGroupsList";
import ProviderConnections from "./ProviderConnections";
import LiveConversations from "./LiveConversations";

const LeftSection = ({
  mode,
  setMode,
  viewMode,
  setViewMode,
  createForm,
  handleCreateChange,
  previewCreate,
  continueCreate,
  joinForm,
  handleJoinChange,
  previewJoin,
  continueJoin,
  myCreatedGroups,
  myExternalGroups,
  connections,
  connectingProvider,
  handleConnectProvider,
  stage,
  setStage,
  loadingFeeds,
  externalFeeds
}) => {
  return (
    <section>
      <HeroCard setMode={setMode} />
      <ModeToggle viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "setup" && (
        <div className="deck-shell">
          <CreateCard 
            createForm={createForm}
            handleCreateChange={handleCreateChange}
            previewCreate={previewCreate}
            continueCreate={continueCreate}
          />
          <JoinCard 
            joinForm={joinForm}
            handleJoinChange={handleJoinChange}
            previewJoin={previewJoin}
            continueJoin={continueJoin}
          />
        </div>
      )}

      {viewMode === "mygroups" && (
        <div style={{ marginTop: "2rem" }}>
          <CreatedGroupsList 
            myCreatedGroups={myCreatedGroups}
            setViewMode={setViewMode}
            setMode={setMode}
          />
          <ExternalGroupsList 
            myExternalGroups={myExternalGroups}
            setViewMode={setViewMode}
          />
        </div>
      )}

      {viewMode === "discover" && (
        <div style={{ marginTop: "2rem" }}>
          <ProviderConnections 
            connections={connections}
            connectingProvider={connectingProvider}
            handleConnectProvider={handleConnectProvider}
            myExternalGroups={myExternalGroups}
          />
          <LiveConversations 
            stage={stage}
            setStage={setStage}
            loadingFeeds={loadingFeeds}
            externalFeeds={externalFeeds}
          />
        </div>
      )}
    </section>
  );
};

export default LeftSection;

