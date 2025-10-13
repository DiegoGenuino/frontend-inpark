import React from 'react';
import { MdDirectionsCar, MdEdit, MdDelete, MdCheckCircle, MdAccessible } from 'react-icons/md';
import Card, { CardBody, CardFooter } from './Card';
import Badge from './Badge';
import Button from './Button';
import './CarCard.css';

export const CarCard = ({ 
  car, 
  onEdit, 
  onDelete,
  onSetPrincipal 
}) => {
  return (
    <Card 
      variant={car.principal ? 'default' : 'outlined'} 
      hoverable 
      className={`car-card ${car.principal ? 'car-card--principal' : ''}`}
    >
      <CardBody>
        <div className="car-card__header">
          <div className="car-card__badges">
            {car.principal && (
              <Badge variant="dark" size="sm" dot>
                Principal
              </Badge>
            )}
            {car.vagaPreferencial && (
              <Badge variant="info" size="sm">
                <MdAccessible /> Preferencial
              </Badge>
            )}
          </div>
        </div>

        <div className="car-card__info">
          <div className="car-card__model">
            <MdDirectionsCar className="car-card__icon" />
            <div>
              <h3 className="car-card__title">{car.modelo}</h3>
              <div className="car-card__subtitle">
                <span className="car-card__color">{car.cor}</span>
                {car.apelido && (
                  <>
                    <span className="car-card__separator">•</span>
                    <span className="car-card__nickname">{car.apelido}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="car-card__plate">
            {car.placa}
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="car-card__actions">
          {!car.principal && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSetPrincipal(car.id)}
              fullWidth
            >
              <MdCheckCircle /> Tornar Principal
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(car)}
            icon={<MdEdit />}
          >
            Editar
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(car)}
            icon={<MdDelete />}
          >
            Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
