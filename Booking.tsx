import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, Alert } from 'react-bootstrap';

export default function Booking({ user }: any) {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  const rows = 5;
  const cols = 8;
  const totalSeats = rows * cols;

  useEffect(() => {
    // Fetch movie details
    fetch(`/api/movies/${movieId}`)
      .then(res => res.json())
      .then(data => setMovie(data));

    // Fetch existing bookings to show booked seats
    fetch(`/api/bookings/${movieId}`)
      .then(res => res.json())
      .then(data => {
        const alreadyBooked = data.flatMap((b: any) => b.seats);
        setBookedSeats(alreadyBooked);
      });
  }, [movieId]);

  const toggleSeat = (seatId: number) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setMessage('Please select at least one seat.');
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          movieId,
          movieTitle: movie.title,
          seats: selectedSeats,
          bookingDate: new Date().toISOString()
        })
      });

      if (res.ok) {
        setMessage('Booking successful! Enjoy your movie.');
        setBookedSeats([...bookedSeats, ...selectedSeats]);
        setSelectedSeats([]);
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      setMessage('Booking failed. Please try again.');
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Book Seats for {movie.title}</h2>
      
      {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm bg-light">
            <div className="screen mb-5 text-center p-2 bg-secondary text-white rounded">
              SCREEN
            </div>

            <div className="seats-container d-flex flex-wrap justify-content-center mb-4" style={{ gap: '10px' }}>
              {Array.from({ length: totalSeats }).map((_, i) => {
                const seatId = i + 1;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <div
                    key={seatId}
                    onClick={() => toggleSeat(seatId)}
                    style={{
                      width: '35px',
                      height: '35px',
                      backgroundColor: isBooked ? '#dc3545' : (isSelected ? '#28a745' : '#6c757d'),
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px'
                    }}
                  >
                    {seatId}
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-center gap-4 mb-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: '15px', height: '15px', backgroundColor: '#6c757d', borderRadius: '3px' }}></div>
                <span>Available</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: '15px', height: '15px', backgroundColor: '#28a745', borderRadius: '3px' }}></div>
                <span>Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: '15px', height: '15px', backgroundColor: '#dc3545', borderRadius: '3px' }}></div>
                <span>Booked</span>
              </div>
            </div>

            <div className="text-center">
              <h5>Selected Seats: {selectedSeats.join(', ') || 'None'}</h5>
              <h4>Total Price: ${selectedSeats.length * 12}</h4>
              <Button 
                variant="primary" 
                size="lg" 
                className="mt-3 px-5"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
