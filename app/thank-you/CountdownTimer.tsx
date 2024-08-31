'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CountdownTimer() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(300) // 300 ثانية = 5 دقائق

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          router.push('/') // إعادة التوجيه إلى الصفحة الرئيسية
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="mt-8">
      <p>سيتم إعادة توجيهك إلى الصفحة الرئيسية خلال {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} دقائق</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(timeLeft / 300) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
