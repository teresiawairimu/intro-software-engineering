import {Container, Col, Row} from 'react-bootstrap';
import MoodPickerCard from '../components/MoodPickerCard';
import NavbarComponent from '../components/NavBarComponent';


const DashboardPage = () => {

  return (
    <div>
      <NavbarComponent />
      <Container>
        <Row className="mt-4">
          <Col md={6}>
           <MoodPickerCard />
          </Col>
        </Row>
      </Container>
    </div>

  )
}

export default DashboardPage;