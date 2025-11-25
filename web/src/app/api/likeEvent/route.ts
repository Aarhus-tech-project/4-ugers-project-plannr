import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL || "https://plannr.azurewebsites.net/api"

export async function POST(req: NextRequest) {
  const body = await req.json()
  // expects: { profileId, currentInterestedEvents, eventId }
  const { profileId, currentInterestedEvents, eventId } = body
  // Get current profile
  const profileRes = await fetch(`${API_BASE_URL}/profiles/${profileId}`)
  const currentProfile = await profileRes.json()
  const updatedEvents = currentInterestedEvents.includes(eventId)
    ? currentInterestedEvents
    : [...currentInterestedEvents, eventId]
  const updatedProfile = { ...currentProfile, interestedEvents: updatedEvents }
  // Update profile
  const updatedProfileRes = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProfile),
  })
  const profile = await updatedProfileRes.json()
  // Get event
  const eventRes = await fetch(`${API_BASE_URL}/events/${eventId}`)
  const event = await eventRes.json()
  const currentInterested = event.attendance?.interested ?? 0
  const attendancePayload = { interested: currentInterested + 1 }
  // Patch attendance
  const attendanceRes = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendancePayload),
  })
  const attendance = await attendanceRes.json()
  return NextResponse.json({ profile, attendance })
}
