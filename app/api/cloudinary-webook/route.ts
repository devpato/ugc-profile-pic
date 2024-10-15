import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const webhookData = await request.json()

  if (webhookData.notification_type === 'moderation' || webhookData.notification_type === 'moderation_summary') {
    const { moderation_status, moderation_kind } = webhookData

    if (moderation_status === 'rejected') {
      let message = ''
      if (moderation_kind === 'aws_rek') {
        message = 'Your image was rejected due to unsuitable content'
      } else if (moderation_kind === 'perception_point') {
        message = 'Your image was rejected due to potential malware'
      }

      return NextResponse.json({ status: 'rejected', message })
    } else if (moderation_status === 'approved') {
      let transformations = 'ar_2:3,c_auto,g_auto,w_300/f_auto,q_auto'
      
      if (webhookData.tags && webhookData.tags.includes('poor_quality')) {
        transformations = `e_gen_restore/e_upscale/e_enhance/e_improve/${transformations}`
      }

      return NextResponse.json({ 
        status: 'approved', 
        imageUrl: `${webhookData.secure_url.replace('/upload/', `/upload/${transformations}/`)}`
      })
    }
  }

  return NextResponse.json({ status: 'unknown' })
}