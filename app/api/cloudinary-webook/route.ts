import { NextResponse } from 'next/server'

// This map will store the moderation results temporarily
const moderationResults = new Map<string, { status: string, message: string }>()

// Predefine moderation messages for cleaner structure
const moderationMessages: Record<string, string> = {
  aws_rek: 'Your image was rejected due to unsuitable content',
  perception_point: 'Your image was rejected due to potential malware',
}

export async function POST(request: Request) {
  const data = await request.json()

  // Handle Cloudinary webhook for moderation
  if (['moderation', 'moderation_summary'].includes(data.notification_type)) {
    const { moderation_status, moderation_kind, asset_id } = data

    const status = moderation_status === 'rejected' ? 'rejected' : 'approved'
    const message = moderation_status === 'rejected' ? moderationMessages[moderation_kind] || '' : 'Image approved'

    // Store the result in memory
    moderationResults.set(asset_id, { status, message })
    return NextResponse.json({ success: true })
  }

  // Handle frontend request to check moderation status
  const { public_id, asset_id } = data
  const moderationResult = moderationResults.get(asset_id)

  // Default response for pending moderation
  if (!moderationResult) {
    return NextResponse.json({ status: 'pending', message: 'Moderation in progress' })
  }

  // Remove the result after retrieving it
  moderationResults.delete(asset_id)

  if (moderationResult.status === 'approved') {
    const poorQuality = data.tags?.includes('poor_quality') || false
    return NextResponse.json({ 
      status: 'approved',
      poorQuality, 
      imageUrl: public_id
    })
  } 
  
  return NextResponse.json({ 
    status: 'rejected', 
    message: moderationResult.message 
  })
}
