import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.js';
import './css/admin.css';
import './css/main.css';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAGE_SIZE = 6;
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  useEffect(() => {
    fetchUsers(currentPage);
  }, []); // ✅ 최초 1번만 전체 users 가져오기
  
  useEffect(() => {
    setCurrentPage(1); // ✅ 검색어 바뀌면 페이지를 1페이지로 리셋
  }, [searchKeyword]);

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
        await axios.delete(`/users/admin/users/${userId}`);
  
        // ✅ 삭제된 유저를 users에서 직접 제거
        setUsers(prev => prev.filter(user => user.user_id !== userId));
  
        // ✅ totalUsers 직접 감소
        setTotalUsers(prev => prev - 1);
  
        // ✅ 삭제 후 현재 페이지 조정
        const filteredUsers = users
          .filter(user =>
            user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchKeyword.toLowerCase())
          )
          .filter(user => user.user_id !== userId); // 방금 삭제한 유저도 제외
        
        const newTotalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages); // 마지막 페이지가 비었으면 페이지 하나 줄임
        }
        
      } catch (error) {
        console.error('❌ 삭제 실패:', error);
        toast.error('삭제 실패', {
          position: "bottom-right",
          autoClose: 1000
        });
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
      toast.success('등급이 성공적으로 변경되었습니다.', {
        position: "bottom-right",
        autoClose: 1000
      });
      fetchUsers(currentPage);
    } catch (error) {
      console.error("❌ 등급 변경 실패:", error);
      toast.error('등급 변경 실패', {
        position: "bottom-right",
        autoClose: 1000
      });
    }
  };

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
            {paginatedUsers.map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.email}</td>
                <td>
                <select
                  className="dropdown-select"
                  value={user.membership_level?.toLowerCase()}
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
