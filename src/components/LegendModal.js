import React from 'react';
import Modal from 'react-modal';
import { facilityDefinitions } from '../constants/facilityDefinitions';

const legendData = Object.values(facilityDefinitions);

const LegendModal = ({ isOpen, onRequestClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Facility Impact Legend"
    ariaHideApp={false}
    style={{
      overlay: { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000 },
      content: {
        maxWidth: 800,
        margin: 'auto',
        borderRadius: 8,
        padding: 20,
        maxHeight: '80vh',
        overflowY: 'auto',
      }
    }}
  >
    <h3 style={{ marginBottom: 16, fontWeight: '700', fontSize: '1.25rem' }}>
      Facility Impact Legend
    </h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #555' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>Facility Name</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Positive Impact (Benefits)</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Negative Impact (Drawbacks)</th>
        </tr>
      </thead>
      <tbody>
        {legendData.map((item) => (
          <tr key={item.label} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '8px', fontWeight: '600' }}>{item.label}</td>
            <td style={{ padding: '8px' }}>{item.benefits}</td>
            <td style={{ padding: '8px' }}>{item.drawbacks}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      onClick={onRequestClose}
      style={{
        marginTop: 20,
        padding: '10px 20px',
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        fontWeight: 'bold',
        cursor: 'pointer',
        float: 'right',
      }}
    >
      Close
    </button>
  </Modal>
);

export default LegendModal;
