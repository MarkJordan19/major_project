import { NextResponse } from "next/server";
import { db as pool } from "@/lib/db";
import { withCORS, handlePreflight } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handlePreflight(request);
}



export async function GET(request: Request) {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    const res =  NextResponse.json({ success: true, rows });

    return withCORS(request,res);

  } catch (error) {
    console.error(error);
    const res = NextResponse.json(
      { success: false, error: "Database connection failed" },
      { status: 500 }
    );

    return withCORS(request,res);

  }
}
