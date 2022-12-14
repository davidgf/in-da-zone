import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

export default function BlockedSites ({ blockedSites, setBlockedSites }: { blockedSites: String[], setBlockedSites: React.Dispatch<React.SetStateAction<String[]>> }): JSX.Element {
  function blockedSitesChanged (change: React.FocusEvent<HTMLTextAreaElement>): void {
    const { value } = change.target
    setBlockedSites(value.split('\n').map(site => site.trim()).filter(site => site !== ''))
  }

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
