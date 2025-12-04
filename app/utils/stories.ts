"use client"
import person from "../.././public/images/person.jpg";
import person1 from "../.././public/images/person1.jpg";
import person2 from "../.././public/images/person2.jpg";
import person3 from "../.././public/images/person3.jpg";
import person4 from "../.././public/images/person4.jpg";
import person5 from "../.././public/images/person5.jpg";

export const profileData = {
  username: "Yousef.dev",
  name: "Yousef Khaled",
  profilePic: person,
  bio: "Web developer and designer. Love to create beautiful and functional websites.",
  followers: 1200,
  following: 300,
  adsCount: 45,
  stories: [
    {
      id: 1,
      date: "2025-09-15",
      images: [
        { src: person, duration: 4000 },
        { src: person1, duration: 4000 },
        { src: person2, duration: 4000 }
      ]
    },
    {
      id: 2,
      date: "2025-09-16",
      images: [
        { src: person4, duration: 5000 },
        { src: person3, duration: 5000 }
      ]
    },
    {
      id: 3,
      date: "2025-09-17",
      images: [
        { src: person5, duration: 4000 },
        { src: person1, duration: 4000 },
        { src: person2, duration: 4000 },
        { src: person3, duration: 4000 }
      ]
    },
    {
      id: 4,
      date: "2025-09-20",
      images: [
        { src: person2, duration: 4000 },
        { src: person5, duration: 4000 },
        { src: person1, duration: 4000 },
        { src: person3, duration: 4000 },
        { src: person, duration: 4000 }
      ]
    }
  ]
};