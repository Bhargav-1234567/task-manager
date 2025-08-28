import { getServerUser } from '@/lib/auth/serverAuth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {
      const user = await getServerUser()
     if (!user) {
      redirect('/login?from=/app')
    }else{
       redirect('/app/dashboard')
    }
  return (
    <div>app</div>
  )
}

export default page