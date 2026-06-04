import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Badge, ListGroup } from 'react-bootstrap';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="mt-5">
      <Row>
        <Col md={4}>
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="img-fluid rounded shadow"
            referrerPolicy="no-referrer"
          />
        </Col>
        <Col md={8}>
          <h1>{movie.title}</h1>
          <div className="mb-3">
            <Badge bg="info" className="me-2">{movie.genre}</Badge>
            <Badge bg="secondary">{movie.duration}</Badge>
          </div>
          <p className="lead">{movie.description}</p>
          
          <h4 className="mt-4">Available Showtimes</h4>
          <ListGroup horizontal className="mb-4">
            {movie.showtimes.map((time: string) => (
              <ListGroup.Item key={time}>{time}</ListGroup.Item>
            ))}
          </ListGroup>

          <Link to={`/booking/${movie.id}`} className="btn btn-success btn-lg">
            Book Tickets Now
          </Link>
        </Col>
      </Row>
    </div>
  );
}
