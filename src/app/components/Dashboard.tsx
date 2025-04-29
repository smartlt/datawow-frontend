"use client";

// Define types for our data
export interface Author {
  _id: string;
  username: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Comment {
  author: Author;
  content: string;
  _id: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: Category;
  author: Author;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}
