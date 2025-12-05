import PostOptionDialogClient from "./PostOptionsClient";

interface PostOptionDialogProps {
  open?: boolean;
  onClose?: () => void;
  postId?: number;
  username?: string;
}

export default function PostOptionDialog(props: PostOptionDialogProps) {
  if (!props.open) return null;
  return <PostOptionDialogClient {...props} />;
}