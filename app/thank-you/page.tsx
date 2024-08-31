'use client'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'
import { formatPrice } from '@/lib/utils'
import Phone from '@/components/Phone'
import CountdownTimer from './CountdownTimer'

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { orderId: string }
}) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const order = await db.order.findUnique({
    where: { id: searchParams.orderId },
    include: { configuration: true },
  })

  if (!user || !order) {
    return <div>حدث خطأ ما. يرجى المحاولة مرة أخرى.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">شكرًا لك على طلبك!</h1>
      <p className="mb-4">تم استلام طلبك بنجاح.</p>
      <p>رقم الطلب: {order.id}</p>
      <p>المبلغ: {formatPrice(order.amount)}</p>
      {order.configuration && (
        <Phone imgSrc={order.configuration.imageUrl} className='w-full h-full'/>
      )}
      
      <CountdownTimer />
    </div>
  )
}
