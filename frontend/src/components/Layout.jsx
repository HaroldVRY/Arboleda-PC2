import React from 'react'
import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <Header />
      <main className="container">{children}</main>
    </div>
  )
}
