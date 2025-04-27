import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { username } = body;

    // Validate the request
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate user credentials against a database
    // 2. Generate a proper JWT token with appropriate expiration
    // 3. Include user roles/permissions in the token payload

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication - this would normally check against a database
    // and include proper error handling for invalid credentials
    const mockUser = {
      id: "123456",
      username,
      name: "Test User",
      role: "user",
    };

    // Generate a mock access token
    // In production, use a proper JWT library with signing
    const accessToken = btoa(
      JSON.stringify({
        userId: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration
      })
    );

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      accessToken,
      user: {
        id: mockUser.id,
        username: mockUser.username,
        name: mockUser.name,
        role: mockUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
