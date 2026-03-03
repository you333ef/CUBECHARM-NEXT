import dynamic from "next/dynamic";

const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => ({ default: mod.ReactPhotoSphereViewer })),
  { ssr: false }
);

export default ReactPhotoSphereViewer;
