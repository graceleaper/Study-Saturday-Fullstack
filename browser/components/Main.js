import React, { Component } from 'react';
import axios from 'axios';

import StudentList from './StudentList.js';
import SingleStudent from './SingleStudent.js';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      selectedStudent: {},
      showStudent: false
    };

    this.selectStudent = this.selectStudent.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getStudents();
  }

  async getStudents() {
    console.log('fetching');
    try {
      const { data } = await axios.get('/student');
      this.setState({ students: data });
    } catch (err) {
      console.error(err);
    }
  }

  selectStudent(student) {
    return this.setState({
      selectedStudent: student,
    });
  }

  //what we'll be putting in our new student form
  async addStudent(student) {
    const { data } = await axios.post('/student', student);
    this.setState({
      students: [...this.state.students, data],
      showStudent: false,
    });
  }

  handleClick(event) {
    this.setState({
      //when our 'Add New Student' button is clicked, 
      //our students will show up
      showStudent: !this.state.showStudent
    })
  }

  render() {
    return (
      <div>
        <h1>Students</h1>
        <button onClick={this.handleClick}>Add New Student</button>
        {/*if our state for showStudent is true (which happens
        AFTER we click our button, then the form below will show up) */}
        {this.state.showStudent ? (
          <NewStudentForm addStudent={this.addStudent} />
        ) : null} {/*if this.state.showStudent is false, DON'T show the form*/}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Tests</th>
            </tr>
          </thead>
          <StudentList
            students={this.state.students}
            selectStudent={this.selectStudent}
          />
        </table>
        {this.state.selectedStudent.id ? (
          <SingleStudent student={this.state.selectedStudent} />
        ) : null}
      </div>
    );
  }
}
