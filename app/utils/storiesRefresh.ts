export const triggerStoriesRefresh = () => {
  window.dispatchEvent(new Event("stories:refresh"));
};
