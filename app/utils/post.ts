export interface Comment {
  id: number;
  username: string;
  userImage: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  username: string;
  userImage: string;
  postImage: string;
  caption: string;
  likes: number;
  timestamp: string;
  comments: Comment[];
  contentType: "post" | "video"

}

export const postsData: Post[] = [
  {
    id: 1,
    contentType: "video",
    username: "john_doe",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    caption: "Amazing sunset view from my balcony ",
    likes: 342,
    timestamp: "2 hours ago",
  comments: [
  {
    id: 1,
    username: "user_1",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    text: "Nice post!",
    timestamp: "1 hour ago",
  },
]

  },
  {
    id: 2,
    contentType: "video",
    username: "travel_guru",
    userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=800&fit=crop",
    caption: "Exploring hidden gems in the mountains ",
    likes: 521,
    timestamp: "5 hours ago",
     comments: [
  {
    id: 1,
    username: "user_1",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    text: "Nice post!",
    timestamp: "1 hour ago",
  }],
  },
  {
    id: 3,
    contentType: "video",
    username: "foodie_life",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop",
    caption: "Homemade pasta night ",
    likes: 289,
    timestamp: "1 day ago",
     comments: [
  {
    id: 1,
    username: "user_1",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    text: "Nice post!",
    timestamp: "1 hour ago",
  }],
  }
];


export const storiesData = [
  {
    id: 1,
    username: "your story",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    isOwn: true
  },
  {
    id: 2,
    username: "john doe",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 3,
    username: "jane smith",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 4,
    username: "travel guru",
    userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 5,
    username: "foodie life",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    hasStory: true
  }
];
