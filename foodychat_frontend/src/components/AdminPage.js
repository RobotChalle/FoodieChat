import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar.js';
import './css/admin.css';
import './css/main.css';
import { Card, CardContent } from '../components/Card.tsx';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,BarChart, XAxis, Legend,CartesianGrid ,YAxis,Bar} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAGE_SIZE = 10;
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

const MEMBERSHIP_LABELS = {
  0: '기본',
  1: '비즈니스',
  2: '관리자',
};

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState({
    totalUserCount: 0,
    newUserCountThisMonth: 0,
    userCountByGrade: [],
  });

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
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('등급이 성공적으로 변경되었습니다.');
      fetchUsers(currentPage);
    } catch (error) {
      console.error('❌ 등급 변경 실패:', error);
      alert('등급 변경 실패');
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    axios.get('/users/admin/user-statistics')
      .then((response) => {
        const data = response.data;
        const enrichedGrades = Array.isArray(data.userCountByGrade)
          ? data.userCountByGrade.map((item) => ({
              ...item,
              grade: MEMBERSHIP_LABELS[item.grade] || `등급 ${item.grade}`,
            }))
          : [];

        setStats({
          totalUserCount: data.totalUserCount || 0,
          newUserCountThisMonth: data.newUserCountThisMonth || 0,
          userCountByGrade: enrichedGrades,
        });
      })
      .catch((error) => {
        console.error('❌ 통계 데이터 불러오기 실패:', error);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      });
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
                .filter(
                  (user) =>
                    user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    user.name?.toLowerCase().includes(searchKeyword.toLowerCase())
                )
                .map((user) => (
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
                      <button className="btn btn-danger" onClick={() => deleteUser(user.user_id)}>
                        삭제
                      </button>
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

      {/* ✅ 통계 카드 - 액자형 레이아웃 */}
      {/* ✅ 통계 카드 및 그래프 - 액자형 레이아웃 */}
<div className="p-10 bg-gray-50 rounded-xl shadow-inner max-w-6xl mx-auto mt-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* 총 유저 수 & 신규 유저 수 그래프 */}
    <Card className="bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg transition duration-300">
      <CardContent className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">유저 통계</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { label: '총 유저 수', count: stats.totalUserCount },
              { label: '이번 달 신규 유저 수', count: stats.newUserCountThisMonth }
            ]}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}명`} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* 회원등급 분포 파이차트 */}
    <Card className="bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg transition duration-300">
      <CardContent className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">회원등급 분포</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stats.userCountByGrade}
              dataKey="count"
              nameKey="membership_level"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ percent, payload }) =>
                `${payload.membership_level} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {stats.userCountByGrade.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}명`}
              labelFormatter={(label) => `등급: ${MEMBERSHIP_LABELS[label] || label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
</div>
    </>
  );
}
