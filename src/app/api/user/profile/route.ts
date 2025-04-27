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

    // In a real application, you would:
    // 1. Verify the token signature
    // 2. Check if it's expired
    // 3. Extract the user information from the token

    try {
      // Decode the mock token (this is just for demonstration purposes)
      const decodedToken = JSON.parse(atob(token));

      // Check if token is expired
      if (decodedToken.exp < Date.now()) {
        return NextResponse.json(
          { message: "Unauthorized - Token expired" },
          { status: 401 }
        );
      }

      // Fetch user data from database (mocked here)
      const userData = {
        id: decodedToken.userId,
        username: decodedToken.username,
        email: `${decodedToken.username}@example.com`,
        name: "Test User",
        role: decodedToken.role,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          language: "en",
        },
      };

      // Return user data
      return NextResponse.json({
        success: true,
        data: userData,
      });
    } catch (error) {
      console.error("Token decode error:", error);
      return NextResponse.json(
        { message: "Unauthorized - Invalid token format" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
