import React from 'react';
import { Link } from 'react-router-dom';

function WarrantyModal({ isOpen, onClose, warranty }) {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal-content">
        <h2>Гарантія виробника</h2>
        <p>
          Допоможемо з будь-якими несправностями товару.<br /><br />
          Просто зв'яжіться з нами за номером телефону або іншим зручним способом в розілі <Link className="warranty-link" to='/'>контакти</Link>.<br /><br />
          Для гарантійного обслуговування знадобляться:<br /><br />
           - детальний опис несправностей товару;<br />
           - гарантійний талон з датою продажу та підписом покупця;<br />
           - фіскальний або е-чек, витратна накладна.<br /><br />
          І, головне, не забудьте сам продукт, що потребує обслуговування 😉<br /><br />
          Офіційна гарантія виробника на даний товар складає: {warranty.value} {warranty.unit}.
        </p>
        <button onClick={onClose}>Зрозуміло</button>
      </div>
    </div>
  );
}

export default WarrantyModal;