'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { changeOrderStatus } from './actions'
import { useRouter } from 'next/navigation'


const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "في انتظار الشحن",
  fulfilled: "تم التوصيل",
  shipped: "تم الشحن"
}

export default function StatusDropdown({id, orderStatus}: {id: string, orderStatus: OrderStatus}) {

  const router = useRouter()
  const {mutate} = useMutation({
    mutationKey: ['updateOrderStatus'],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh()
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-52 flex justify-between items-center'>
          {LABEL_MAP[orderStatus]}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='p-0'>
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem key={status} className={cn("flex items-center text-sm gap-1 p-2.5 cursor-default hover:bg-zinc-100", {
            "bg-zinc-100": orderStatus === status
          })} onClick={() => mutate({id, newStatus: status as OrderStatus})}>
            <Check className={cn("mr-2 h-4 w-4 text-primary", orderStatus === status ? "opacity-100" : 'opacity-0')} />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
