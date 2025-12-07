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
}

export const postsData: Post[] = [
  {
    id: 1,
    username: "john_doe",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    caption: "Amazing sunset view from my balcony 🌅",
    likes: 342,
    timestamp: "2 hours ago",
    comments: [
      {
        id: 1,
        username: "jane_smith",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        text: "Absolutely stunning! ",
        timestamp: "1 hour ago"
      },
      {
        id: 2,
        username: "mike_wilson",
        userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
        text: "Where is this? Looks beautiful!",
        timestamp: "45 mins ago"
      }
    ]
  },
  {
    id: 2,
    username: "travel_guru",
    userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=800&h=800&fit=crop",
    caption: "Exploring hidden gems in the mountains 🏔️",
    likes: 521,
    timestamp: "5 hours ago",
    comments: [
      {
        id: 3,
        username: "adventure_seeker",
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        text: "This is on my bucket list!",
        timestamp: "3 hours ago"
      }
    ]
  },
  {
    id: 3,
    username: "foodie_life",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    postImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop",
    caption: "Homemade pasta night 🍝",
    likes: 289,
    timestamp: "1 day ago",
    comments: [
      {
        id: 4,
        username: "chef_master",
        userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        text: "Looks delicious! Recipe please?",
        timestamp: "18 hours ago"
      },
      {
        id: 5,
        username: "pasta_lover",
        userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
        text: "Making me hungry! 😋",
        timestamp: "12 hours ago"
      }
    ]
  }
];

export const storiesData = [
  {
    id: 1,
    username: "your_story",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    isOwn: true
  },
  {
    id: 2,
    username: "john_doe",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 3,
    username: "jane_smith",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 4,
    username: "travel_guru",
    userImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    hasStory: true
  },
  {
    id: 5,
    username: "foodie_life",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    hasStory: true
  }
];
