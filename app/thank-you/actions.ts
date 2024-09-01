"use server"

import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

type getPaymentStatusProp = {
  orderId: string
}

export const getPaymentStatus = async ({orderId}: getPaymentStatusProp) => {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('you need to be logged in to view this page.')
  }

  const order = await db.order.findUnique({
    where: {id: orderId, userId: user.id},
    include: {
      billingAddress: true,
      shippingAddress: true,
      configuration: true,
      user: true
    }
  })
  if (!order) throw new Error('this order dose not exist.')

  if (order.isPaid) {
    return order
  } else {
    return false
  }
}