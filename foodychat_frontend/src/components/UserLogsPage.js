import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import 'react-datepicker/dist/react-datepicker.css';
import './css/admin.css';
import './css/main.css';
import './css/userlog.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAGE_SIZE = 10;

export default function UserLogsPage() {
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(endOfMonth);

  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1);
  }, [searchEmail, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/logs`, {
        params: {
          page,
          size: PAGE_SIZE,
          email: searchEmail,
          status: statusFilter === 'ALL' ? null : statusFilter,
          startDate: startDate ? formatDate(startDate) : null,
          endDate: endDate ? formatDate(endDate) : null,
        },
        withCredentials: true,
      });
      setLogs(res.data.logs || []);
      setTotalLogs(res.data.total || 0);
    } catch (err) {
      console.error('❌ 로그 불러오기 실패:', err);
    }
  };

  const totalPages = Math.ceil(totalLogs / PAGE_SIZE);

  const handleDownloadCSV = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/admin/logs`, {
        params: {
          page: 1,
          size: 100000, // 충분히 큰 숫자로 전체 데이터 요청
          email: searchEmail,
          status: statusFilter === 'ALL' ? null : statusFilter,
          startDate: startDate ? formatDate(startDate) : null,
          endDate: endDate ? formatDate(endDate) : null,
        },
        withCredentials: true,
      });
  
      const allLogs = res.data.logs || [];
  
      const header = "회원ID,Email,IP,로그인일시,로그아웃일시,상태,실패이유\n";
      const csv = allLogs.map(log =>
        `${log.userId || ''},"${log.email || ''}",${log.ipAddress},${log.loginTime},${log.logoutTime},${log.loginStatus},${log.failureReason}`
      ).join("\n");
  
      const blob = new Blob([header + csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "user_logs_full.csv");
    } catch (err) {
      console.error('❌ 전체 로그 다운로드 실패:', err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-inner">
          <h2 className="section-title">사용자 로그 조회</h2>

          <div className="search-row">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="시작일자"
              locale={ko}
              className="date-input"
            />

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="종료일자"
              locale={ko}
              className="date-input"
            />

            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="1">성공</option>
              <option value="0">실패</option>
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="이메일 검색"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>

          <div className="table-header">
            <button onClick={handleDownloadCSV} className="btn csv-button">📥 CSV</button>
          </div>

          <table className="admin-table">
            <colgroup>
              <col style={{ width: '6%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '30%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>유저ID</th>
                <th>이메일</th>
                <th>IP</th>
                <th>로그인일시</th>
                <th>로그아웃일시</th>
                <th>상태</th>
                <th>실패이유</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={`${log.id}`}>
                  <td>{log.userId || '-'}</td>
                  <td>{log.email || '-'}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.loginTime || '-'}</td>
                  <td>{log.logoutTime || '-'}</td>
                  <td>{log.loginStatus || '-'}</td>
                  <td>{log.failureReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}