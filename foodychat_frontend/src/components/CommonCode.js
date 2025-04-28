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
  const [modalType, setModalType] = useState(null); // 'create' or 'edit'
  const [newCode, setNewCode] = useState({ code_id: '', code_name: '' });
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/codes`, { withCredentials: true });
      const result = Array.isArray(res.data) ? res.data : res.data.codes; // 안전 처리
      setCodes(result);
    } catch (err) {
      console.error('❌ 코드 목록 불러오기 실패:', err);
      setCodes([]); // 안전 초기화
    }
  };

  const openCreateModal = () => {
    setNewCode({ code_id: '', code_name: '' });
    setDetails([]);
    setModalType('create');
  };

  const openEditModal = async (code) => {
    setSelectedCode(code);
    setNewCode({ code_id: code.code_id, code_name: code.code_name });
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/codes/${code.code_id}/details`, { withCredentials: true });
      setDetails(res.data);
      setModalType('edit');
    } catch (err) {
      console.error('❌ 세부 코드 조회 실패:', err);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCode(null);
    setDetails([]);
  };

  const handleAddDetailRow = () => {
    const newDetail = {
      detail_code: '',
      detail_name: '',
      reg_id: '관리자',
      reg_date: new Date().toLocaleString(),
    };
    setDetails([...details, newDetail]);
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm(`코드 ${codeId}을(를) 삭제하시겠습니까?`)) return;
  
    try {
      await axios.delete(`${BASE_URL}/users/admin/codes/delete/${codeId}`, {
        withCredentials: true,
      });
      fetchCodes(); // 삭제 후 목록 새로고침
    } catch (err) {
      console.error('❌ 코드 삭제 실패:', err);
    }
  };

  const handleDeleteDetailRow = async (index) => {
    const detail = details[index];

    // 서버에 저장된 항목일 경우만 DELETE 요청
    if (detail.detail_code && modalType === 'edit') {
      try {
        await axios.delete(
          `${BASE_URL}/users/admin/codes/delete/${newCode.code_id}/details/${detail.detail_code}`,
          { withCredentials: true }
        );
      } catch (err) {
        console.error('❌ 세부 항목 삭제 실패:', err);
        return;
      }
    }

    // 프론트엔드에서 목록 제거
    const updatedDetails = [...details];
    updatedDetails.splice(index, 1);
    setDetails(updatedDetails);
  };

  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-inner">
          <h2 className="section-title">공통 코드 관리</h2>
          <div className="scroll-table-container">
            <div className="table-header">
              <button className="btn ghost-icon-button" onClick={openCreateModal}>＋ 코드 등록</button>
            </div>
            <table className="admin-table">
              <colgroup>
                <col style={{ width: '14%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>코드ID</th>
                  <th>코드명</th>
                  <th>등록자</th>
                  <th>등록일</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(codes) && codes.map(code => (
                  <tr key={code.code_id} onClick={() => openEditModal(code)} style={{ cursor: 'pointer' }}>
                    <td>{code.code_id}</td>
                    <td className="code-name-column">{code.code_name}</td>
                    <td>{code.reg_id}</td>
                    <td>{code.reg_date}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // 수정 모달 열리지 않도록
                          handleDeleteCode(code.code_id);
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modalType && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{modalType === 'edit' ? '✏️ 코드 수정' : '📌 코드 등록'}</h3>
                  <button onClick={closeModal} className="close-button">×</button>
                </div>

                <div className="modal-body compact-body">
                  <div className="input-group-horizontal">
                    <div className="input-subgroup code-id-group">
                      <label>코드 ID</label>
                      <input
                        type="text"
                        className="form-input-sm"
                        value={newCode.code_id}
                        disabled={modalType === 'edit'}
                        onChange={(e) => setNewCode({ ...newCode, code_id: e.target.value })}
                      />
                    </div>
                    <div className="input-subgroup code-name-group">
                      <label>코드명</label>
                      <input
                        type="text"
                        className="form-input-sm"
                        value={newCode.code_name}
                        onChange={(e) => setNewCode({ ...newCode, code_name: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="detail-table-wrapper">
                  <table className="admin-table compact-table">
                    <thead>
                      <tr>
                        <th>코드</th>
                        <th>코드명</th>
                        <th>등록자</th>
                        <th>등록일</th>
                        <th>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((detail, idx) => (
                        <tr key={idx}>
                          <td><input className="table-input" value={detail.detail_code} onChange={(e) => {
                            const newDetails = [...details];
                            newDetails[idx].detail_code = e.target.value;
                            setDetails(newDetails);
                          }} /></td>
                          <td><input className="table-input" value={detail.detail_name} onChange={(e) => {
                            const newDetails = [...details];
                            newDetails[idx].detail_name = e.target.value;
                            setDetails(newDetails);
                          }} /></td>
                          <td>{detail.reg_id}</td>
                          <td>{detail.reg_date}</td>
                          <td>
                            <button className="delete-btn" onClick={() => handleDeleteDetailRow(idx)}>삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  <button onClick={handleAddDetailRow} className="btn secondary">행 추가</button>
                  <button
                    className="btn primary"
                    onClick={async () => {
                      try {
                        const payload = {
                          code: newCode,
                          details: details
                        };

                        await axios.post(`${BASE_URL}/users/admin/codes/save`, payload, {
                          withCredentials: true,
                        });

                        closeModal();
                        setNewCode({ code_id: '', code_name: '' });
                        fetchCodes();
                      } catch (err) {
                        console.error('❌ 저장 실패:', err);
                      }
                    }}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}