import React from 'react';
import '../Page/page.css'

function ReturnPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal-content">
        <h2>Обмін/Повернення товару</h2>
        <p>
          Обміну/поверненню підлягає товар:<br /><br />
           - належної якості<br />
           - який не використовувався<br />
           - збережено його товарний вигляд<br />
           - пломби, ярлики<br /><br />
          та інші споживчі властивості.
        </p>
        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
}

export default ReturnPolicyModal;