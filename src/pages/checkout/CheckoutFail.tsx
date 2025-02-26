import { CheckCircle } from '@mui/icons-material'
import React from 'react'

export default function CheckoutFail() {
  return (
    <div className="h">
      <CheckCircle className="" />
      <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Thanh toán thành công!</h1>
      <p className="text-lg text-white mb-6 text-center max-w-md">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ sớm xử lý đơn hàng của bạn và liên hệ khi hàng được giao.</p>
    </div>
  )
}
