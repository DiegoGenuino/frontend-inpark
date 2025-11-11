import React from 'react';
import { MdLocationOn, MdAccessTime, MdLocalParking } from 'react-icons/md';
import Card, { CardBody, CardFooter } from './Card';
import Badge from './Badge';
import Button from './Button';
import './ParkingCard.css';

export const ParkingCard = ({ 
  parking, 
  onReserve, 
  onViewDetails 
}) => {
  const availableSpots = parking.maximoDeVagas - (parking.vagasOcupadas || 0);
  const occupancyRate = ((parking.maximoDeVagas - availableSpots) / parking.maximoDeVagas) * 100;

  const getStatusVariant = () => {
    if (occupancyRate > 80) return 'danger';
    if (occupancyRate > 50) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (occupancyRate > 80) return 'Lotado';
    if (occupancyRate > 50) return 'Médio';
    return 'Disponível';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5);
  };

  return (
    <Card variant="outlined" hoverable className="parking-card">
      <CardBody>
        <div className="parking-card__header">
          <h3 className="parking-card__title">{parking.nome}</h3>
          <Badge variant={getStatusVariant()} size="sm">
            {getStatusText()}
          </Badge>
        </div>

        <div className="parking-card__info">
          <div className="parking-card__info-item">
            <MdLocationOn className="parking-card__icon" />
            <div>
              <p className="parking-card__address">{parking.endereco}, {parking.numero}</p>
              <p className="parking-card__cep">CEP {parking.CEP}</p>
            </div>
          </div>

          <div className="parking-card__info-item">
            <MdAccessTime className="parking-card__icon" />
            <div>
              <p className="parking-card__hours">
                {formatTime(parking.horaAbertura)} - {formatTime(parking.horaFechamento)}
              </p>
            </div>
          </div>

          <div className="parking-card__spots">
            <div className="parking-card__spot-item">
              <span className="parking-card__spot-number">{availableSpots}</span>
              <span className="parking-card__spot-label">Livres</span>
            </div>
            <div className="parking-card__spot-item">
              <span className="parking-card__spot-number">{parking.maximoDeVagas}</span>
              <span className="parking-card__spot-label">Total</span>
            </div>
            <div className="parking-card__spot-item">
              <span className="parking-card__spot-number">{parking.vagasPreferenciais}</span>
              <span className="parking-card__spot-label">Pref.</span>
            </div>
          </div>

          <div className="parking-card__progress">
            <div 
              className="parking-card__progress-bar"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="parking-card__actions">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onViewDetails(parking)}
          >
            Ver Detalhes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};


export default ParkingCard;