import React from 'react';
import styles from './styles.module.css';

export interface Visitor {
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  citizenship: string;
  registration_region: string;
  gender: string;
  passport: string;
  email: string;
  phone: string;
  purpose_visit: string;
  car_plate: string;
}

export interface Visit {
  id: number;
  creator_id: number;
  admin_id: number;
  territory_id: number;
  track_id: number;
  start_date: string;
  end_date: string;
  visitors: Visitor[];
  status: string;
}

interface Props {
  onClose: () => void;
  visitDetails: Visit;
  onApprove: () => void;
  onReject: () => void;
}

const VisitDetailsModal: React.FC<Props> = ({ onClose, visitDetails, onApprove, onReject }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2>Детали посещения</h2>
        <div>
          <h3>Информация о посетителях:</h3>


          <div className={styles.visitorsList}>
            {visitDetails.visitors.map((person, index) => (
              <div className={styles.visitorsItem} key={index}>
                <div className={styles.visitorId}><strong>{index + 1}</strong></div>
                <div className={styles.info}>
                  <strong>ФИО:</strong> {person.surname} {person.name} {person.patronymic} <br />
                  <strong>Дата рождения:</strong> {person.birthday} <br />
                  <strong>Гражданство:</strong> {person.citizenship} <br />
                  <strong>Регион регистрации:</strong> {person.registration_region} <br />
                  <strong>Пол:</strong> {person.gender} <br />
                  <strong>Паспорт:</strong> {person.passport} <br />
                  <strong>Почта:</strong> {person.email} <br />
                  <strong>Телефон:</strong> {person.phone} <br />
                  <strong>Цель визита:</strong> {person.purpose_visit} <br />
                  <strong>Регистрационный номер автомобиля:</strong> {person.car_plate} <br />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.confirmButtons_container}>
          <button className={styles.confirmButtons_confirm} onClick={onApprove}>Одобрить</button>
          <button className={styles.confirmButtons_cancel} onClick={onReject}>Отклонить</button>
          <button className={styles.closeButton} onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsModal;
