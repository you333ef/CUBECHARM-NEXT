import PostOptionDialogClient from "./PostOptionsClient";
import type { PostOptionDialogProps } from "./PostOptionsClient";

export default function PostOptionDialog(props: PostOptionDialogProps) {
  if (!props.open) return null;
  return <PostOptionDialogClient {...props} />;
}
