"use client";
import dynamic from "next/dynamic";
import Personal_Data_Profile from "./componants/Personal_Data_Profile"
const Account = () => {
  const StoryViewer = dynamic(() => import("./componants/StoryViewer"), {
  ssr: false,
});
const StoriesProfilee = dynamic(() => import("./componants/StoriesProfilee"), {
  ssr: false,
});
const ADsAnd_Videos = dynamic(() => import("./componants/ADsAnd_Videos"), {
  ssr: false,
});
  return (
    <>
   <section aria-label="User profile" className="p-4 max-w-screen-xl mx-auto">
  <div >
    <Personal_Data_Profile />
    <StoriesProfilee />
  <StoryViewer/>
    <ADsAnd_Videos />
  </div>
</section>
{/* 


 <ADsAndVideos/>
*/}
    </>
  )
}
export default Account