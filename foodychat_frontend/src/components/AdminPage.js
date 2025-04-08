import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './css/admin-user-list.css';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:8080/admin/users', { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err);
        setError('회원 목록을 불러오는 데 실패했습니다.');
      });
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert('삭제할 회원을 선택하세요.');
      return;
    }

    if (!window.confirm('정말로 선택한 회원을 삭제하시겠습니까?')) return;

    try {
      await axios.post('http://localhost:8080/admin/deleteUsers', selectedUsers, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      setMessage('선택한 회원이 삭제되었습니다.');
      setSelectedUsers([]);
      fetchUsers(); // 새로고침
    } catch (err) {
      console.error(err);
      setError('회원 삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin-user-list-wrapper">
        <h2>회원 목록</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button onClick={handleDeleteSelected} className="delete-button">
          선택 삭제
        </button>
        <table className="user-table">
          <thead>
            <tr>
              <th><input
                type="checkbox"
                onChange={(e) =>
                  setSelectedUsers(e.target.checked ? users.map(u => u.user_id) : [])
                }
                checked={selectedUsers.length === users.length && users.length > 0}
              /></th>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>등급</th> 
              <th>성별</th>
              <th>키</th>
              <th>몸무게</th>
              <th>주소</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={() => handleCheckboxChange(user.user_id)}
                  />
                </td>
                <td>{user.user_id}</td>
                <td>{user.user_name}</td>
                <td>{user.email}</td>
                <td>{user.membership_lvl}</td>
                <td>{user.gender}</td>
                <td>{user.height}</td>
                <td>{user.user_weight}</td>
                <td>{user.user_address}</td>
                <td>{user.reg_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
