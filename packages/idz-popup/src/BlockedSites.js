import React from 'react'
import './BlockedSites.css'

export default function BlockedSitesContainer () {
  return (
    <>
      <div class='Blocked-sites-container'>
        <textarea class='Blocked-sites-input' />
        <button class='Toggle-blocking-status'>Enter da zone</button>
      </div>
    </>
  )
}
