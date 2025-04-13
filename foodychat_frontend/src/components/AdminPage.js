import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.js';
import './css/admin.css';
import './css/main.css';
const PAGE_SIZE = 10;
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`/users/admin/users?page=${page}&size=${PAGE_SIZE}`);
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error('❌ 유저 불러오기 실패:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        console.error(userId)
        await axios.delete(`/users/admin/users/${userId}`);
        fetchUsers(currentPage);
      } catch (error) {
        console.error('❌ 삭제 실패:', error);
      }
    }
  };
  const handleLevelChange = async (userId, newLevel) => {
    try {
      await axios.patch(
        `/users/admin/users/${userId}/membership`,
        { membership_level: newLevel },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("등급이 성공적으로 변경되었습니다.");
      fetchUsers(currentPage);
    } catch (error) {
      console.error("❌ 등급 변경 실패:", error);
      alert("등급 변경 실패");
    }
  };
  
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  return (
    <>
    <NavBar />
    <div className="admin-wrapper">
      <div className="admin-inner">
      <h2 className="section-title">회원 목록</h2>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="이메일 또는 이름으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>유저 ID</th>
              <th>이메일</th>
              <th>등급</th>
              <th>가입일</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {users
            .filter(user =>
              user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              user.name?.toLowerCase().includes(searchKeyword.toLowerCase())
            )
            .map(user => (

              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.email}</td>
                <td>
                <select
                className="dropdown-select"
                value={user.membership_level}
              onChange={(e) => handleLevelChange(user.user_id, e.target.value)}
                >
                  <option value="regular">기본</option>
                  <option value="business">비즈니스</option>
                  <option value="admin">관리자</option>
                </select>
                </td>
                <td>{user.join_date}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteUser(user.user_id)}>삭제</button>
                </td>
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
