import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/db'
import { formatPrice } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import StatusDropdown from './StatusDropdown'

export default async function DashboardPage() {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!user || user.email !== ADMIN_EMAIL) {
    return redirect('/')
  }

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7))
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: true,
      shippingAddress: true
    }
  })

  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      amount: true,
    },
  })
  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      amount: true,
    },
  })

  const WEEKLY_GOAL = 500
  const MONTHLY_GOAL = 5000

  return (
    <div className='flex w-full min-h-screen bg-muted/40'>
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>الأسبوع الماضي</CardDescription>
                <CardTitle className='text-4xl'>{formatPrice(lastWeekSum._sum.amount ?? 0)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                 {formatPrice(WEEKLY_GOAL)}
                 <span> من هدف </span>
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lastWeekSum._sum.amount ?? 0) * 100 ) / WEEKLY_GOAL} />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>الشهر الماضي</CardDescription>
                <CardTitle className='text-4xl'>{formatPrice(lastMonthSum._sum.amount ?? 0)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                 {formatPrice(MONTHLY_GOAL)}
                 <span> من هدف </span>
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={((lastMonthSum._sum.amount ?? 0) * 100 ) / MONTHLY_GOAL} />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            الطلبات الواردة
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead className=' sm:table-cell'>الحالة</TableHead>
                <TableHead className=' sm:table-cell'>تاريخ الشراء</TableHead>
                <TableHead className='text-right'>المبلغ</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className='bg-accent'>
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div className="text-sm text-muted-foreground md:inline">
                      {order.user?.email ? order.user.email : 'البريد الإلكتروني غير متوفر'}
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>

                  <TableCell className='table-cell'>{order.createdAt.toLocaleDateString('ar-SA')}</TableCell>

                  <TableCell className='text-right'>{formatPrice(order.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
