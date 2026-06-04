import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Currently Showing</h2>
      <Row>
        {movies.map(movie => (
          <Col key={movie.id} md={4} className="mb-4">
            <Card h-full="true">
              <Card.Img 
                variant="top" 
                src={movie.poster} 
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text className="text-muted">
                  {movie.genre} • {movie.duration}
                </Card.Text>
                <div className="d-grid gap-2">
                  <Link to={`/movie/${movie.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                  <Link to={`/booking/${movie.id}`} className="btn btn-outline-success">
                    Book Now
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
