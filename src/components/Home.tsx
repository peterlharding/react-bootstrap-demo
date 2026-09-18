import {Link} from 'react-router';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {version} from '../../package.json';
import {experiments} from '../app/experiments';

import './Home.css';

const Home = () => (
  <div className='container home' style={{width: '80%'}}>
    <section className='home-hero'>
      <h1 className='display-5 text-info'>Sandpit</h1>
      <p className='lead'>
        A small React playground for trying out React Bootstrap components,
        client-side routing and Redux Toolkit state.
      </p>
      <div className='home-actions'>
        <Link to='/help' className='btn btn-primary btn-lg'>Get started</Link>
        <Link to='/about' className='btn btn-outline-secondary btn-lg'>About the project</Link>
      </div>
    </section>

    <h2 className='h4 home-section-title'>Experiments</h2>
    <Row xs={1} md={3} className='g-4'>
      {experiments.map(({to, name, what}) => (
        <Col key={to}>
          <Card className='h-100 home-card'>
            <Card.Body>
              <Card.Title as='h3' className='h5'>{name}</Card.Title>
              <Card.Text>{what}</Card.Text>
            </Card.Body>
            <Card.Footer className='bg-transparent border-0'>
              <Link to={to} className='stretched-link'>Try it<span className='visually-hidden'>: {name}</span></Link>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>

    <p className='home-whats-new'>
      Version {version}. <Link to='/release-notes'>See what&apos;s new</Link>.
    </p>
  </div>
);

export default Home;
