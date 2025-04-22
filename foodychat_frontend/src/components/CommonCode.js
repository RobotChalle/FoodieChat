import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import './css/admin.css';
import './css/main.css';
import './css/common-code.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CommonCodePage() {
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState({ code_id: '', code_name: '' });
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/codes`, { withCredentials: true });
      setCodes(res.data);
    } catch (err) {
      console.error('❌ 코드 목록 불러오기 실패:', err);
    }
  };

  const handleRowClick = async (code) => {
    setSelectedCode(code);
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/codes/${code.code_id}/details`, { withCredentials: true });
      setDetails(res.data);
      setDetailModalOpen(true);
    } catch (err) {
      console.error('❌ 세부 코드 조회 실패:', err);
    }
  };

  const closeModal = () => {
    setDetailModalOpen(false);
    setSelectedCode(null);
    setDetails([]);
  };

  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-inner">
          <h2 className="section-title">공통 코드 관리</h2>
          <div className="scroll-table-container">
            <div className="table-header">
                <button className="btn ghost-icon-button" onClick={() => setCreateModalOpen(true)}>＋ 코드 등록</button>
            </div>
            <table className="admin-table">
              <colgroup>
                <col style={{ width: '15%' }} />
                <col style={{ width: '45%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>코드ID</th>
                  <th>코드명</th>
                  <th>등록자</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.code_id} onClick={() => handleRowClick(code)} style={{ cursor: 'pointer' }}>
                    <td>{code.code_id}</td>
                    <td className="code-name-column">{code.code_name}</td>
                    <td>{code.reg_id}</td>
                    <td>{code.reg_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {createModalOpen && (
            <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📌 코드 등록</h3>
                    <button onClick={() => setCreateModalOpen(false)} className="close-button">X</button>
                </div>
                <div className="modal-body">
                    <input
                        className="form-input"
                        type="text"
                        placeholder="코드 ID"
                        value={newCode.code_id}
                        onChange={(e) => setNewCode({ ...newCode, code_id: e.target.value })}
                    />
                    <input
                        className="form-input"
                        type="text"
                        placeholder="코드명"
                        value={newCode.code_name}
                        onChange={(e) => setNewCode({ ...newCode, code_name: e.target.value })}
                    />
                </div>
                <div className="modal-footer">
                    <button
                        className="btn primary"
                        onClick={async () => {
                            try {
                                await axios.post(`${BASE_URL}/users/admin/codes`, newCode, { withCredentials: true });
                                setCreateModalOpen(false);
                                setNewCode({ code_id: '', code_name: '' });
                                fetchCodes();
                            } catch (err) {
                                console.error('❌ 코드 등록 실패:', err);
                            }
                        }}
                    >
                    저장
                    </button>
                </div>
                </div>
            </div>
          )}

          {detailModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>세부 코드 목록 - {selectedCode.code_name}</h3>
                  <button onClick={closeModal} className="close-button">X</button>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Detail Code</th>
                      <th>Detail Name</th>
                      <th>등록자</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, idx) => (
                      <tr key={idx}>
                        <td>{detail.detail_code}</td>
                        <td>{detail.detail_name}</td>
                        <td>{detail.reg_id}</td>
                        <td>{detail.reg_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}