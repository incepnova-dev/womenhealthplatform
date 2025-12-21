import React from "react";
import LiveQAForum from "./LiveQAForum";
import SafetyCard from "./SafetyCard";
import CommunityOverview from "./CommunityOverview";
import FreshDiscussions from "./FreshDiscussions";

const RightSection = ({
  stage,
  setStage,
  externalFeeds,
  loadingFeeds,
  fetchExternalFeeds,
  myCreatedGroups,
  myExternalGroups,
  connections,
  setViewMode
}) => {
  return (
    <aside className="right-column">
      <LiveQAForum />
      <SafetyCard />
      <CommunityOverview 
        myCreatedGroups={myCreatedGroups}
        myExternalGroups={myExternalGroups}
        connections={connections}
        externalFeeds={externalFeeds}
      />
      <FreshDiscussions 
        stage={stage}
        setStage={setStage}
        loadingFeeds={loadingFeeds}
        externalFeeds={externalFeeds}
        fetchExternalFeeds={fetchExternalFeeds}
        setViewMode={setViewMode}
      />
    </aside>
  );
};

export default RightSection;

