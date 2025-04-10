import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './css/admin.css';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        nickname: '홍길동',
        name: '홍길동',
        gender: '남성',
        birth: '1990-01-01',
        height: 175,
        weight: 70,
        goal: '근육 증가',
        email: 'hong@example.com',
        phone: '010-1111-2222',
        role: 'user',
        joinDate: '2024-01-15',
      },
      {
        id: 2,
        nickname: '관리자',
        name: '관리자',
        gender: '여성',
        birth: '1985-06-20',
        height: 165,
        weight: 55,
        goal: '체중 감량',
        email: 'admin@example.com',
        phone: '010-1234-5678',
        role: 'admin',
        joinDate: '2023-12-01',
      },
    ];
    setUsers(mockData);
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setEditableUser({ ...user });
  };

  const closeModal = () => {
    setSelectedUser(null);
    setEditableUser(null);
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert('삭제할 회원을 선택해주세요.');
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setUsers(users.filter((user) => !selectedIds.includes(user.id)));
      setSelectedIds([]);
    }
  };

  const downloadExcel = () => {
    const csvContent = [
      ['ID', '닉네임', '성별', '생년월일', '키', '체중', '목표', '이메일', '전화번호', '등급'],
      ...users.map((u) => [
        u.id,
        u.nickname,
        u.gender,
        u.birth,
        u.height,
        u.weight,
        u.goal,
        u.email,
        u.phone,
        u.role,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
  };

  const handleRoleChange = (e) => {
    setEditableUser({ ...editableUser, role: e.target.value });
  };

  const handleReply = (userId) => {
    alert(`회원 ${userId}의 문의 답변 페이지로 이동합니다.`);
  };

  const toggleSearch = () => setSearchVisible(!searchVisible);

  const filteredUsers = users
    .filter((user) => {
      const matchSearch = user.nickname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = !roleFilter || user.role === roleFilter;
      const matchGender = !genderFilter || user.gender === genderFilter;
      return matchSearch && matchRole && matchGender;
    })
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return new Date(b.joinDate) - new Date(a.joinDate);
      } else {
        return new Date(a.joinDate) - new Date(b.joinDate);
      }
    });

  return (
    <div className="container">
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">🍽 <span>FoodyChat</span></Link>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">회원 목록</h2>
        <FaSearch className="search-icon" onClick={toggleSearch} />
      </div>

      {searchVisible && (
        <>
          <div className="search-row">
            <input
              type="text"
              className="search-input"
              placeholder="닉네임으로 검색"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="btn-search">검색</button>
          </div>

          <div className="filter-row">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
              <option value="">전체 등급</option>
              <option value="user">일반</option>
              <option value="admin">관리자</option>
              <option value="business">비즈니스</option>
            </select>

            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="filter-select">
              <option value="">전체 성별</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>

            <button
              className="btn-sort"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
              가입일 {sortOrder === 'desc' ? '▼' : '▲'}
            </button>

            <button
              className="btn-reset"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('');
                setGenderFilter('');
                setSortOrder('desc');
              }}
            >
              초기화
            </button>
          </div>
        </>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>선택</th>
            <th>유저 ID</th>
            <th>닉네임</th>
            <th>유저 등급</th>
            <th>가입 날짜</th>
            <th>조작</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleCheckbox(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td
                onDoubleClick={() => openModal(user)}
                style={{ cursor: 'pointer' }}
              >
                {user.nickname}
              </td>
              <td>{user.role}</td>
              <td>{user.joinDate}</td>
              <td>
                <button className="btn btn-outline" onClick={() => handleReply(user.id)}>
                  답변하기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-row">
        <button className="btn btn-danger" onClick={handleDeleteSelected}>
          선택 삭제
        </button>
        <button className="btn btn-success" onClick={downloadExcel}>
          엑셀 다운로드
        </button>
      </div>

      {selectedUser && editableUser && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>회원 상세정보</h3>
            <table className="detail-table">
              <tbody>
                <tr><td>이름</td><td>{editableUser.name}</td></tr>
                <tr><td>성별</td><td>{editableUser.gender}</td></tr>
                <tr><td>생년월일</td><td>{editableUser.birth}</td></tr>
                <tr><td>키 (cm)</td><td>{editableUser.height}</td></tr>
                <tr><td>체중 (kg)</td><td>{editableUser.weight}</td></tr>
                <tr><td>건강목표</td><td>{editableUser.goal}</td></tr>
                <tr>
                  <td>유저 등급</td>
                  <td>
                    <select
                      className="dropdown-select"
                      value={editableUser.role}
                      onChange={handleRoleChange}
                    >
                      <option value="user">일반</option>
                      <option value="admin">관리자</option>
                      <option value="business">비즈니스</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-buttons">
              <button className="btn btn-warning" onClick={() => alert('수정')}>
                수정
              </button>
              <button className="btn btn-primary" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
