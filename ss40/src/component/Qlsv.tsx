import React, { useReducer, useState, useEffect } from "react";
import "./Qlsv.css";

interface Student {
  id: number;
  name: string;
  birthday: string;
  email: string;
  address: string;
  status: boolean;
}

interface State {
  students: Student[];
  student: Student;
}

const initialState: State = {
  students: [],
  student: {
    id: 0,
    name: "",
    birthday: "",
    email: "",
    address: "",
    status: true,
  },
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_STUDENTS":
      return { ...state, students: action.payload };
    case "SET_NEW_STUDENT":
      return { ...state, student: action.payload };
    case "ADD_STUDENT":
      return { ...state, students: [...state.students, action.payload] };
    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(
          (student) => student.id !== action.payload
        ),
      };
    case "TOGGLE_STATUS":
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload
            ? { ...student, status: !student.status }
            : student
        ),
      };
    case "UPDATE_STUDENT":
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        ),
      };
    default:
      return state;
  }
};

const Students: React.FC = () => {
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showEditEmployeeForm, setShowEditEmployeeForm] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedStudents = localStorage.getItem("ListStudent");
    if (storedStudents) {
      dispatch({ type: "SET_STUDENTS", payload: JSON.parse(storedStudents) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ListStudent", JSON.stringify(state.students));
  }, [state.students]);

  const handleAddEmployee = () => setShowAddEmployeeForm(true);
  const handleCloseForm = () => setShowAddEmployeeForm(false);
  const handleCloseEditForm = () => setShowEditEmployeeForm(false);

  const handleBlock = (id: number) => {
    setSelectedStudentId(id);
    setShowBlockModal(true);
  };

  const handleDelete = (id: number) => {
    setSelectedStudentId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (student: Student) => {
    dispatch({ type: "SET_NEW_STUDENT", payload: student });
    setShowEditEmployeeForm(true);
  };

  const closeModals = () => {
    setShowBlockModal(false);
    setShowDeleteModal(false);
    setSelectedStudentId(null);
  };

  const handleConfirmBlock = () => {
    if (selectedStudentId !== null) {
      dispatch({ type: "TOGGLE_STATUS", payload: selectedStudentId });
    }
    closeModals();
  };

  const handleConfirmDelete = () => {
    if (selectedStudentId !== null) {
      dispatch({ type: "DELETE_STUDENT", payload: selectedStudentId });
    }
    closeModals();
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = { ...state.student, id: Date.now() };
    dispatch({ type: "ADD_STUDENT", payload: newStudent });
    handleCloseForm();
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_STUDENT", payload: state.student });
    handleCloseEditForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    dispatch({
      type: "SET_NEW_STUDENT",
      payload: { ...state.student, [id]: value },
    });
  };

  return (
    <div className="w-80 m-auto mt-4 h-100vh">
      <main className="main">
        <header className="d-flex justify-content-between mb-3">
          <h3>Nhân viên</h3>
          <button className="btn btn-primary" onClick={handleAddEmployee}>
            Thêm mới nhân viên
          </button>
        </header>
        <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
          <input
            style={{ width: "350px" }}
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo email"
          />
          <i className="fa-solid fa-arrows-rotate" title="Refresh"></i>
        </div>
        <table className="table table-bordered table-hover table-striped">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Chặn/Bỏ chặn</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {state.students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.birthday}</td>
                <td>{student.email}</td>
                <td>{student.address}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      className={`status ${
                        student.status ? "status-active" : "status-inactive"
                      }`}
                    ></div>
                    <span>{student.status ? "Đang hoạt động" : "Đã chặn"}</span>
                  </div>
                </td>
                <td>
                  <span
                    className="button button-block"
                    onClick={() => handleBlock(student.id)}
                  >
                    {student.status ? "Chặn" : "Bỏ chặn"}
                  </span>
                </td>
                <td>
                  <span
                    className="button button-edit"
                    onClick={() => handleEdit(student)}
                  >
                    Sửa
                  </span>
                </td>
                <td>
                  <span
                    className="button button-delete"
                    onClick={() => handleDelete(student.id)}
                  >
                    Xóa
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer className="d-flex justify-content-end align-items-center gap-3">
          <select className="form-select">
            <option>Hiển thị 10 bản ghi trên trang</option>
            <option>Hiển thị 20 bản ghi trên trang</option>
            <option>Hiển thị 50 bản ghi trên trang</option>
            <option>Hiển thị 100 bản ghi trên trang</option>
          </select>
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#">
                Previous
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </footer>
      </main>

      {showAddEmployeeForm && (
        <div className="overlay">
          <form className="form" onSubmit={handleAddStudent}>
            <div className="d-flex justify-content-between align-items-center">
              <h4>Thêm nhân viên</h4>
              <i className="fa-solid fa-xmark" onClick={handleCloseForm}></i>
            </div>
            <div>
              <label className="form-label" htmlFor="name">
                Họ và tên
              </label>
              <input
                onChange={handleInputChange}
                id="name"
                type="text"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="birthday">
                Ngày sinh
              </label>
              <input
                onChange={handleInputChange}
                id="birthday"
                type="date"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                onChange={handleInputChange}
                id="email"
                type="email"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="address">
                Địa chỉ
              </label>
              <input
                onChange={handleInputChange}
                id="address"
                className="form-control"
              />
            </div>
            <div>
              <button className="w-100 btn btn-primary" type="submit">
                Thêm mới
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditEmployeeForm && (
        <div className="overlay">
          <form className="form" onSubmit={handleUpdateStudent}>
            <div className="d-flex justify-content-between align-items-center">
              <h4>Sửa nhân viên</h4>
              <i
                className="fa-solid fa-xmark"
                onClick={handleCloseEditForm}
              ></i>
            </div>
            <div>
              <label className="form-label" htmlFor="name">
                Họ và tên
              </label>
              <input
                onChange={handleInputChange}
                id="name"
                type="text"
                value={state.student.name}
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="birthday">
                Ngày sinh
              </label>
              <input
                onChange={handleInputChange}
                id="birthday"
                type="date"
                value={state.student.birthday}
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                onChange={handleInputChange}
                id="email"
                type="email"
                value={state.student.email}
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="address">
                Địa chỉ
              </label>
              <input
                onChange={handleInputChange}
                id="address"
                value={state.student.address}
                className="form-control"
              />
            </div>
            <div>
              <button className="w-100 btn btn-primary" type="submit">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {showBlockModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-title">
              <h4>Cảnh báo</h4>
              <i className="fa-solid fa-xmark" onClick={closeModals}></i>
            </div>
            <div className="modal-body-custom">
              <span>Bạn có chắc chắn muốn chặn tài khoản này?</span>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-light" onClick={closeModals}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleConfirmBlock}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-title">
              <h4>Cảnh báo</h4>
              <i className="fa-solid fa-xmark" onClick={closeModals}></i>
            </div>
            <div className="modal-body-custom">
              <span>Bạn có chắc chắn muốn xóa tài khoản này?</span>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-light" onClick={closeModals}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
