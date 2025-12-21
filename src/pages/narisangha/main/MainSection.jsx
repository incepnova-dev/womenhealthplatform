import React from "react";
import LeftSection from "../leftsection/LeftSection";
import RightSection from "../rightsection/RightSection";

const MainSection = ({
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
  externalFeeds,
  fetchExternalFeeds,
}) => {
  return (
    <main className="main">
      <div className="content-wrap" id="start">
        <LeftSection
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
        />

        <RightSection
          stage={stage}
          setStage={setStage}
          externalFeeds={externalFeeds}
          loadingFeeds={loadingFeeds}
          fetchExternalFeeds={fetchExternalFeeds}
          myCreatedGroups={myCreatedGroups}
          myExternalGroups={myExternalGroups}
          connections={connections}
          setViewMode={setViewMode}
        />
      </div>
    </main>
  );
};

export default MainSection;

