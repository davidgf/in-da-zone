import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import * as browser from 'webextension-polyfill'

const BLOCKED_HOSTS_KEY = 'blockedHosts'

export default function BlockedSites (): JSX.Element {
  const [blockedSites, setBlockedSites] = useState<String[]>([])

  function blockedSitesChanged (change: React.FocusEvent<HTMLTextAreaElement>): void {
    const { value } = change.target
    setBlockedSites(value.split('\n').map(site => site.trim()).filter(site => site !== ''))
  }

  useEffect(() => {
    browser.storage.local.get()
      .then(result => {
        const persistedBlockedSites = (result[BLOCKED_HOSTS_KEY] !== undefined)
          ? result[BLOCKED_HOSTS_KEY]
          : []
        setBlockedSites(persistedBlockedSites)
      })
      .catch(err => console.error('Error loading blocked sites', err))
  }, [])

  useEffect(() => {
    browser.storage.local.set({ [BLOCKED_HOSTS_KEY]: blockedSites })
      .catch(err => console.error('Error saving blocked sites', err))
  })

  return (
    <Container>
      <Row className='mt-3'>
        <Col>
          <Form.Group>
            <Form.Label>Blocked Websites (enter one per line)</Form.Label>
            <Form.Control
              as='textarea'
              rows={8}
              defaultValue={blockedSites.join('\n')}
              onBlur={blockedSitesChanged}
              placeholder={['twitter.com', 'instagram.com', '...'].join('\n')}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  )
}
