import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sheetUrl = searchParams.get("url");

  if (!sheetUrl) {
    return NextResponse.json(
      { success: false, error: "Apps Script Web App URL is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(sheetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 0 }, // Disable Next.js caching for this request
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Google Sheets: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("API GET Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to communicate with Google Sheets" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url: sheetUrl, action, data } = body;

    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: "Apps Script Web App URL is required" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, data }),
    });

    if (!res.ok) {
      throw new Error(`Failed to post to Google Sheets: ${res.statusText}`);
    }

    const resData = await res.json();
    return NextResponse.json(resData);
  } catch (error) {
    console.error("API POST Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to post to Google Sheets" },
      { status: 500 }
    );
  }
}
