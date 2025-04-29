import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");

    // Check if Authorization header exists and has the correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // In a real application, you would verify the token and get user ID

    // Mock data for development
    const mockPosts = [
      {
        _id: "post-1",
        title: "The Beginning of the End of the World",
        content:
          "The afterlife sitcom The Good Place comes to its culmination, the show's two protagonists, Eleanor and Chidi, contemplate their future. Having lived and experienced virtually everything this life has to offer, they're faced with an existential choice.",
        category: { _id: "cat-1", name: "History" },
        author: { _id: "user-1", username: "Jessica" },
        comments: [],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        _id: "post-2",
        title: "The Power of Pets",
        content:
          "Nothing compares to the joy of coming home to a loyal companion. The unconditional love of a pet can do more than keep you company. Pets may also decrease stress, improve heart health, and even help children with their emotional and social skills.",
        category: { _id: "cat-6", name: "Pets" },
        author: { _id: "user-1", username: "Jessica" },
        comments: [
          {
            _id: "comment-1",
            author: { _id: "user-2", username: "Alex" },
            content: "I couldn't agree more! My dog has changed my life.",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Return posts data
    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
